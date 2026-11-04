const logger=require("@codekro/logger");
const Docker=require("dockerode");
const {createHash}=require("crypto");
const path=require("path");
const {PassThrough}=require("stream");
const fsp=require("fs/promises");
const os=require("os");

const DEFAULT_EXECUTION_TIMEOUT_MS = 10_000;

const LANGUAGES = {
    cpp: { file: "main.cpp", command: "g++ main.cpp -o program && ./program < input.txt" },
    py: { file: "main.py", command: "python3 main.py < input.txt" },
    java: { file: "Main.java", command: "javac Main.java && java Main < input.txt" },
};

const docker=new Docker(
    process.env.DOCKER_SOCKET_PATH
        ? { socketPath: process.env.DOCKER_SOCKET_PATH }
        : {}
);

const imagePromises=new Map();

const ensureImage=async(language)=>{
    const imagePath=path.resolve(__dirname,"../","image",language);
    const dockerfilePath=path.join(imagePath,"dockerfile");
    const dockerfile=await fsp.readFile(dockerfilePath);
    const hash=createHash("sha256").update(dockerfile).digest("hex").slice(0,12);
    const tag=`codekro/${language}:${hash}`;
    const cacheKey=`${language}:${hash}`;

    if(imagePromises.has(cacheKey)){
        return imagePromises.get(cacheKey);
    }

    const promise=(async()=>{
        try{
            await docker.getImage(tag).inspect();
            return tag;
        }catch(error){
            if(error.statusCode!==404 && !/no such image/i.test(error.message || "")){
                throw error;
            }
        }

        logger.info(`Building docker image ${tag}`);
        const stream=await docker.buildImage(
            {
                context:imagePath,
                src:["dockerfile"],
            },
            {
                t:tag,
                dockerfile:"dockerfile",
            }
        );

        await new Promise((resolve,reject)=>{
            docker.modem.followProgress(stream,(err,res)=>{
                if(err) reject(err);
                else resolve(res);
            });
        });
        logger.info(`Docker image ready ${tag}`);
        return tag;
    })().catch(error=>{
        imagePromises.delete(cacheKey);
        throw error;
    });

    imagePromises.set(cacheKey,promise);
    return promise;
};

const dockerExecutor= async(language,input,code,problem,timeoutMs = DEFAULT_EXECUTION_TIMEOUT_MS)=>{
    let workDir;
    let container;
    try {
        if(!language || !input || !code || !problem){
            logger.error("Invalid input",language,input,code,problem);
            throw new Error("Invalid input");
        }
        const languageConfig=LANGUAGES[language];
        if(!languageConfig){
            logger.error(`Unsupported language: ${language}`);
            throw new Error(`Unsupported language: ${language}`);
        }
        const tempRootDir=path.join(os.tmpdir(),"codekro");
        // fsp.mkdir returns a Promise — do NOT pass a callback (that's the old
        // fs.mkdir signature). With { recursive: true } it resolves to the first
        // directory created, or undefined if it already existed. No error is
        // thrown when the directory already exists.
        await fsp.mkdir(tempRootDir, { recursive: true });

        workDir=await fsp.mkdtemp(path.join(tempRootDir,`${problem.toString()}`));

        // Write source files asynchronously — fsp.writeFile yields to the event
        // loop while the OS writes the buffer, keeping other BullMQ heartbeats
        // and HTTP handlers running during concurrent submissions.
        await Promise.all([
            fsp.writeFile(path.join(workDir,"input.txt"), input),
            fsp.writeFile(path.join(workDir,languageConfig.file), code),
        ]);
        const imageTag=await ensureImage(language);

    const command=languageConfig.command;
    container=await docker.createContainer({
      Image:imageTag,
      WorkingDir:"/wdr",
      Cmd: ["sh","-c",command] ,
      HostConfig:{
      Binds:[
          `${workDir}:/wdr`],
        NetworkMode: "none",
        Memory: 256 * 1024 * 1024,
        NanoCpus: 1 * 1e9,
        PidsLimit: 64
    }
    })
    await container.start();
        const log=await container.logs({
            stdout:true,
            stderr:true,
            follow:true
        });
        let output="";
        let error="";
        const stdout=new PassThrough();
        const stderr=new PassThrough();
        stdout.on("data",(data)=>{
            output+=data.toString();
        })
        stderr.on("data",(data)=>{
            error+=data.toString();
        })
        container.modem.demuxStream(
            log,
            stdout,
            stderr
        );
        let timeout;
        const completed = await Promise.race([
            container.wait().then(() => true),
            new Promise(resolve => {
                timeout = setTimeout(async () => {
                    await container.kill().catch(() => undefined);
                    resolve(false);
                }, timeoutMs);
            })
        ]);
        clearTimeout(timeout);
        if (!completed) {
            error += "\nExecution timed out";
        }

        // Individual file cleanup is intentionally omitted here.
        // The finally block below runs fsp.rm(workDir, { recursive: true })
        // unconditionally — it removes the entire temp directory whether the
        // job succeeded, timed out, or threw. Calling existsSync/unlinkSync
        // per-file before that point would:
        //   1. block the event loop synchronously on every submission, and
        //   2. do work that the finally already does for free.
        await container.remove({
            force: true
        });
        if (!completed) throw new Error("Execution timed out");
        return {output,error}
        
    } catch (error) {
        logger.error("Docker execution failed", error.message);
        throw error;
    } finally {
        if (container) await container.remove({force:true}).catch(() => undefined);
        if (workDir) await fsp.rm(workDir,{recursive:true,force:true}).catch(() => undefined);
    }
}
module.exports={dockerExecutor}
