const {Worker}=require("bullmq");
const EXECUTION_TIMEOUT_MS = parseInt(process.env.EXECUTION_TIMEOUT_MS ?? "10000", 10);
const {dockerExecutor}=require("./dockerExecutor");
const {judgementService}=require("./judgementService_controller");
const {io_client}=require("@codekro/io-redis-config");
const {Solution,problem:Problem}=require("@codekro/db_config");
const {client,updateCachedProblemState}=require("@codekro/redis-config");
const logger=require("@codekro/logger");

const markProblemSubmitted=async(userId,problemId)=>{
    await Problem.updateOne(
        {_id:problemId,user_id:String(userId)},
        {$set:{submitted:true}}
    );

    try {
        await updateCachedProblemState(String(userId),String(problemId),{submitted:true});
    } catch (error) {
        logger.error(`Failed to update submitted cache: ${error.message}`);
        await client.del(`problem:${userId}`).catch(()=>undefined);
    }
};

const executionWorker=async()=>{
    logger.info("Execution worker started");
    const worker=new Worker("problem-queue",
        async(job)=>{
            const {code,language,input,user,problem,test_case}=job.data;
            try {
                const existingSolution=await Solution.findOne({job_id:job.id});
                if(existingSolution){
                    if(String(existingSolution.judgement?.verdict || "").toUpperCase()==="ACCEPTED"){
                        await markProblemSubmitted(user,problem);
                    }
                    return existingSolution;
                }
                const {output,error}=await dockerExecutor(language,input,code,problem,EXECUTION_TIMEOUT_MS);
                    const judgement=await judgementService(output,test_case,code,language);
                    const StoreSolutionInDB= await Solution.create({
                        job_id:job.id,
                        user_id:user,
                        problem_id:problem,
                        language:language,
                        code:code,
                        input:input,
                        output:output ?? "",
                        error:error ?? "",
                        judgement:judgement
                    });
                if(String(judgement?.verdict || "").toUpperCase()==="ACCEPTED"){
                    await markProblemSubmitted(user,problem);
                }
             return StoreSolutionInDB;
               
            } catch (error) {
                if(error.code===11000){
                    const duplicateSolution=await Solution.findOne({job_id:job.id});
                    if(duplicateSolution){
                        if(String(duplicateSolution.judgement?.verdict || "").toUpperCase()==="ACCEPTED"){
                            await markProblemSubmitted(user,problem);
                        }
                        return duplicateSolution;
                    }
                }
                logger.error(`job failed ${error.stack}`);
                throw error
                
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
    worker.on("completed",(job)=>{
        logger.info("Worker completed",job.id);
    });
    worker.on("failed",(job,error)=>{
        logger.error("Worker failed",job?.id,error.stack);
    });
    return worker;
}
module.exports={executionWorker,markProblemSubmitted}