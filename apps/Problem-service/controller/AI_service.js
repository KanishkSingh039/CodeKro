const logger = require("@codekro/logger");
const {IOQueue}=require("../queue/queue");
const problemgeneratorQueue=IOQueue("problem-generator-queue");
const AI_serviceController=async(req,res,next)=>{
    try {
        const user_id = req.user?.id || req.body?.user_id;
        const {service}=req.body;
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
        removeOnComplete: {age: 3600},
        removeOnFail: {age: 86400}
    });

        return res.status(202).json({ message: "Problem generation queued", job_id: job.id });
    } catch (error) {
        logger.error("Failed to generate problem", error.message);
        res.status(500).json({ message: error.message });
    }
}
const problemGenerationStatus=async(req,res)=>{
    try {
        const job=await problemgeneratorQueue.getJob(req.params.jobId);
        if(!job) return res.status(404).json({message:"Problem generation job not found"});

        if(job.data.user_id !== req.user.id) {
            return res.status(404).json({message:"Problem generation job not found"});
        }

        const state=await job.getState();
        return res.status(200).json({
            job_id:job.id,
            state,
            problem:state==="completed" ? job.returnvalue : undefined,
            error:state==="failed" ? job.failedReason : undefined
        });
    } catch(error) {
        logger.error("Failed to get problem generation status",error.message);
        return res.status(500).json({message:"Failed to get problem generation status"});
    }
}
module.exports={AI_serviceController,problemGenerationStatus};
