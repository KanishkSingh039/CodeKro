const logger=require("@codekro/logger");
const Docker=require("dockerode");
const path=require("path");
const {PassThrough}=require("stream");
const fsp=require("fs/promises");
const fs=require("fs");
const os=require("os");

const EXECUTION_TIMEOUT_MS = 10_000;

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
const dockerExecutor= async(language,input,code,problem,timesup)=>{
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
        await fsp.mkdir(tempRootDir, { recursive: true },(err) => {
        if (err) throw err;
        console.log("Directory created");
        });

        workDir=await fsp.mkdtemp(path.join(tempRootDir,`${problem.toString()}`));
        
        fs.writeFileSync(path.join(workDir,"input.txt"),input);    
        fs.writeFileSync(path.join(workDir,languageConfig.file),code);
        const imagePath = path.resolve(
            __dirname,
            "../",
            "image",
            language
        );

        const stream= await docker.buildImage({
            context:imagePath,
            src:["dockerfile"],
            
        },
        {
            t:`codekro/${language}`
        }
    )
    
    await new Promise((resolve, reject) => {
    docker.modem.followProgress(
        stream,
        (err, res) => {
            if (err) {
                reject(err);
                return;
            }
            
            resolve(res);
        }
    );
});
    const command=languageConfig.command;
    container=await docker.createContainer({
      Image:`codekro/${language}`,
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
                }, EXECUTION_TIMEOUT_MS);
            })
        ]);
        clearTimeout(timeout);
        if (!completed) {
            error += "\nExecution timed out";
        }
        if(fs.existsSync(path.join(workDir, "input.txt")))
        {
            fs.unlinkSync(path.join(workDir, "input.txt"));
        }
        if(fs.existsSync(path.join(workDir, languageConfig.file)))
        {
            fs.unlinkSync(path.join(workDir, languageConfig.file));
        }
        if(fs.existsSync(path.join(workDir, "program")))
        {
            fs.unlinkSync(path.join(workDir, "program"));
        }
        if(fs.existsSync(path.join(workDir, "Main.class")))
        {
            fs.unlinkSync(path.join(workDir, "Main.class"));
        }
        
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
