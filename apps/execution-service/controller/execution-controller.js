const logger = require("@codekro/logger");
const {executionWorker}=require("./executionWorker");
const {IOQueue}=require("../queue/IOqueue");
const {QueueEvents}=require("bullmq");
const { client } = require("@codekro/redis-config");
const IOqueue=IOQueue("problem-queue");
const solutionQueue=IOQueue("solution-queue");
const IOqueueEvents=new QueueEvents("problem-queue",{connection:client});
const execution = async (req, res) => {
    try {
        const {user_id, problem_id, code, language, input ,test_case } = req.body;
        if(!user_id || !problem_id)
            return res.status(400).json({ message: "Bad Request" });
        if (!code || !language || !input)
            return res.status(400).json({ message: "Bad Request" });
        const problemqueuejobId=`${user_id}_${problem_id}`;
        const job=await IOqueue.add("code-submit",{
            code:code,
            language:language,
            input:input,
            test_case:test_case,
            user:user_id,
            problem:problem_id,
        },
        {
            jobId:problemqueuejobId,
        }
    );
    
          await executionWorker();
          const result=await job.waitUntilFinished(
            IOqueueEvents,
            60000
          )  ;
                       
            
        return res.status(200).json({ message: "Execution successful", data:{
            user_id,
            problem_id,
            result
        } });
    }
    catch(err)
    {
        logger.error("Execution failed", err.stack);
        return res.status(500).json({ message: err.message });
    }
}
module.exports={execution}