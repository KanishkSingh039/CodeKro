const {Worker}=require("bullmq");
const {dockerExecutor}=require("./dockerExecutor");
const {judgementService}=require("./judgementService_controller");
const {io_client}=require("@codekro/io-redis-config");
const {Solution}=require("@codekro/db_config");
const logger=require("@codekro/logger");
const {IOQueue}=require("../queue/IOqueue");
const solutionQueue=IOQueue("solution-queue");
const executionWorker=async()=>{
    const worker=new Worker("problem-queue",
        async(job)=>{
            const {code,language,input,user,problem,test_case}=job.data;
            try {
                const {output,error}=await dockerExecutor(language,input,code,problem);
                    const jobid=`solution_${user}_${problem}`
                    const judgement=await judgementService(output,test_case,code,language);
                    const StoreSolutionInDB= await Solution.create({
                        user_id:user,
                        problem_id:problem,
                        language:language,
                        code:code,
                        input:input,
                        output:output,
                        error:error,
                        judgement:judgement
                    });
                    await solutionQueue.add("solution-submit",{
                        StoreSolutionInDB,
                        user
                    },{
                        jobId:jobid
                    })
             return StoreSolutionInDB;
               
            } catch (error) {
                logger.error(`job failed ${error.stack}`);
                
            }
            
        },
        {
            connection:io_client,
            concurrency:2
        }
    )
    worker.on("error",(error)=>{
        logger.error("Worker error",error.stack);
    });
    worker.on("closed",()=>{
        logger.info("Worker closed");
    });
    worker.on("active",()=>{
        logger.info("Worker active");
    });
    worker.on("completed",(job,result)=>{
        logger.info("Worker completed",job.data,result);
    });
    worker.on("failed",(job,error)=>{
        logger.error("Worker failed",job.data,error.stack);
    });
}
module.exports={executionWorker}