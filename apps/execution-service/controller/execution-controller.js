const logger = require("@codekro/logger");
const { randomUUID } = require("crypto");
const {Solution}=require("@codekro/db_config");
const {getCachedSolution,setCachedSolution}=require("@codekro/redis-config");
const {IOQueue}=require("../queue/IOqueue");
const IOqueue=IOQueue("problem-queue");
const execution = async (req, res) => {
    try {
        const { problem_id, code, language, input ,test_case } = req.body;
        const user_id=req.user.id;
        if(!user_id || !problem_id || !code || !language)
            return res.status(400).json({ message: "Bad Request" });
        const normalizedInput=typeof input==="string" ? input : input==null ? "" : JSON.stringify(input);
        const normalizedTestCases=Array.isArray(test_case) ? test_case : [];
        const jobId=randomUUID();
        const job=await IOqueue.add("code-submit",{
            code:code,
            language:language,
            input:normalizedInput,
            test_case:normalizedTestCases,
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
const latestSolution = async (req,res) => {
    const userId=req.user?.id;
    const problemId=req.params.problemId;

    if(!userId || !problemId)
        return res.status(400).json({ message: "Bad Request" });

    try {
        let cachedSolution=null;
        try {
            cachedSolution=await getCachedSolution(String(userId),String(problemId));
        } catch (error) {
            logger.error(`Failed to read solution cache: ${error.message}`);
        }

        if(cachedSolution)
            return res.status(200).json({ message: "Solution fetched", solution: cachedSolution });

        const solution=await Solution.findOne({
            user_id:String(userId),
            problem_id:String(problemId)
        }).sort({updatedAt:-1}).lean();

        if(!solution)
            return res.status(404).json({ message: "Solution not found" });

        try {
            await setCachedSolution(String(userId),String(problemId),solution);
        } catch (error) {
            logger.error(`Failed to cache solution: ${error.message}`);
        }

        return res.status(200).json({ message: "Solution fetched", solution });
    } catch (error) {
        logger.error(`Failed to fetch solution: ${error.message}`);
        return res.status(500).json({ message: "Failed to fetch solution" });
    }
};

module.exports={execution,executionStatus,latestSolution};
