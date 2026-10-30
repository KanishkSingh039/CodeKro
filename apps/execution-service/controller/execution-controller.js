const logger = require("@codekro/logger");
const { randomUUID } = require("crypto");
const {IOQueue}=require("../queue/IOqueue");
const IOqueue=IOQueue("problem-queue");
const execution = async (req, res) => {
    try {
        const { problem_id, code, language, input ,test_case } = req.body;
        const user_id=req.user.id;
        if(!user_id || !problem_id)
            return res.status(400).json({ message: "Bad Request" });
        if (!code || !language || !input)
            return res.status(400).json({ message: "Bad Request" });
        const jobId=randomUUID();
        const job=await IOqueue.add("code-submit",{
            code:code,
            language:language,
            input:input,
            test_case:test_case,
            user:user_id,
            problem:problem_id,
        },
        {
            jobId,
        }
    );
        return res.status(202).json({ message: "Execution queued", job_id: job.id });
    }
    catch(err)
    {
        logger.error("Execution failed", err.stack);
        return res.status(500).json({ message: "Failed to queue execution" });
    }
}
const executionStatus = async (req,res)=>{
    try{
        const job=await IOqueue.getJob(req.params.jobId);
        if(!job) return res.status(404).json({message:"Execution job not found"});
        if(job.data.user!==req.user.id) return res.status(404).json({message:"Execution job not found"});
        const state=await job.getState();
        return res.status(200).json({
            job_id:job.id,
            state,
            result:state==="completed" ? job.returnvalue : undefined,
            error:state==="failed" ? job.failedReason : undefined
        });
    }catch(err){
        logger.error("Failed to get execution status",err.stack);
        return res.status(500).json({message:"Failed to get execution status"});
    }
}
module.exports={execution,executionStatus};
