const logger=require("@codekro/logger");
const Docker=require("dockerode");
const path=require("path");
const {PassThrough}=require("stream");
const fs=require("fs");

const docker=new Docker({
    socketPath: "/Users/kanishk/.docker/run/docker.sock"
});
const dockerExecutor= async(language,input,code)=>{
    try {
        const workDir = path.resolve(
            __dirname,
            "../",
            "temp_wdr"
        );
        fs.writeFileSync(path.join(workDir,"input.txt"),input);    
        fs.writeFileSync(path.join(workDir,`main.${language}`),code);
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
let languageCommands = {
        "cpp": `g++ main.cpp -o program && ./program < input.txt`,
        "py": `python3 main.py < input.txt`,
        "java": `javac Main.java && java Main < input.txt`,
    };
    const command=languageCommands[language];
    const container=await docker.createContainer({
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
        await container.wait();
        if(fs.existsSync(path.join(workDir, "input.txt")))
        {
            fs.unlinkSync(path.join(workDir, "input.txt"));
        }
        if(fs.existsSync(path.join(workDir, `main.${language}`)))
        {
            fs.unlinkSync(path.join(workDir, `main.${language}`));
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
        return {output,error}
        
    } catch (error) {
        logger.error("Docker execution failed", error.message);
        throw error;
    }
}
module.exports={dockerExecutor}