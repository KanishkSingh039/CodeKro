const logger=require("@codekro/logger");
const Docker=require("dockerode");
const path=require("path");
const docker=new Docker({
    socketPath: "/Users/kanishk/.docker/run/docker.sock"
});
const dockerExecutor= async(code,language,input,command)=>{
    try {
        const imagePath = path.resolve(
            __dirname,
            "../",
            "image",
            language
        );

        const workDir = path.resolve(
            __dirname,
            "../",
            "temp_wdr"
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
    return container;
        
    } catch (error) {
        logger.error("Docker execution failed", error.message);
        throw error;
    }
}
module.exports={dockerExecutor}