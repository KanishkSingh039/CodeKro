const logger=require("@codekro/logger");
const Docker=require("dockerode");
const docker=new Docker();
const dockerExecutor= async(code,language,input,command)=>{
    try {
        const stream= await docker.buildImage({
            context:`/apps/execution-service/image/${language}`,
            src:["dockerfile"],
            
        },
        {
            t:`codekro/${language}`
        }
    )
    let image;
    await new Promise((resolve, reject) => {
        docker.modem.followProgress(stream, (err, res) => {
            if(err)
            {
                logger.error("Docker build failed", err.message);
                reject(err);
                return;
            }
            image=res;
            logger.info("Docker build successful", res);
            resolve(res);
        }
    )
    });
    const container=await docker.createContainer({
      Image:image,
      WorkingDir:"/wdr",
      Cmd:[command]  ,
      Binds:[
          `./temp_wdr:/wdr`],
        NetworkMode: "none",
        Memory: 256 * 1024 * 1024,
        NanoCpus: 1 * 1e9,
        PidsLimit: 64
    })
    return container;
        
    } catch (error) {
        logger.error("Docker execution failed", error.message);
        return error.message;
    }
}
module.exports={dockerExecutor}