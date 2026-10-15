const logger = require("@codekro/logger");
const {IOQueue}=require("../queue/queue");
const {QueueEvents}=require("bullmq")
const problemgeneratorQueue=IOQueue("problem-generator-queue");
const {io_client}=require("@codekro/io-redis-config");
const IOqueueEvents=new QueueEvents("problem-generator-queue",{connection:io_client});
const AI_serviceController=async(req,res)=>{
    try {
        const {user_id,service}=req.body;
        if(!user_id||!service)
        {
            logger.error("User_id/service is empty ")
            return res.status(400).json({ message: "Bad Request" });
        }
        const job=await problemgeneratorQueue.add("problem-generator",{
            user_id:user_id,
            service:service
        },
    {
        jobId:`problem_${user_id}`,
        removeOnComplete: true,
        removeOnFail: true
    });
        
        
        const problem=await job.waitUntilFinished(IOqueueEvents,60000);
        
        logger.info("Problem generated", problem);
        return res.status(200).json({ message: "Problem generated", problem });
    } catch (error) {
        logger.error("Failed to generate problem", error.message);
        res.status(500).json({ message: error.message });
    }
}
module.exports=AI_serviceController;