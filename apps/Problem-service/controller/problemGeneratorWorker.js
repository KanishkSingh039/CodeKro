const {Worker}=require("bullmq")
const {io_client}=require("@codekro/io-redis-config")
const {client}=require("@codekro/redis-config")
const {prompt}=require("../AI_service/prompt")
const {LLM_service}=require("../AI_service/LLm")
const {problem}=require("@codekro/db_config")
const logger=require("@codekro/logger")
const problemgeneratorWorker=async()=>{
    const worker=new Worker("problem-generator-queue",async(job)=>{
        const {user_id,service}=job.data;
        const solvedquestionofuser=await client.LRANGE(`problem:${user_id}`,0,-1);
        const history=solvedquestionofuser?.map(item=>{
            return JSON.parse(item);
        })
                const problemgenerated=await LLM_service(prompt(service,history));
        const SaveProblemAtDB=await problem.create({
                    user_id:user_id,
                    title:problemgenerated.title,
                    description:problemgenerated.description,
                    test_case:problemgenerated.test_case,
                    difficulty:problemgenerated.difficulty
                })
         await client.RPUSH(`problem:${user_id}`,JSON.stringify(SaveProblemAtDB.toObject()));
            return SaveProblemAtDB;
    },
    {
        connection:io_client,
        concurrency:1
    })

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
        return worker;
}
module.exports={problemgeneratorWorker}