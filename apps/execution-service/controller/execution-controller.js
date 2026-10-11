const logger = require("@codekro/logger");
const {executionWorker}=require("./executionWorker");
const { client } = require("@codekro/redis-config");
const execution = async (req, res) => {
    try {
        const {user_id, problem_id, code, language, input ,test_case } = req.body;
        if(!user_id || !problem_id)
            return res.status(400).json({ message: "Bad Request" });
        if (!code || !language || !input)
            return res.status(400).json({ message: "Bad Request" });
        await client.lPush("problem-queue",JSON.stringify({
            code:code,
            language:language,
            input:input,
            test_case:test_case,
            user:user_id,
            problem:problem_id,
        }));
        
        await executionWorker();
            const solution=await client.brPop(`solution : ${user_id}:${problem_id}`,5);
            const result=JSON.parse(solution.element);
            await client.lPush(`solution : ${user_id}:${problem_id}`,JSON.stringify(result))            
            
        return res.status(200).json({ message: "Execution successful", data:{
            user_id,
            problem_id
        } });
    }
    catch(err)
    {
        logger.error("Execution failed", err.stack);
        return res.status(500).json({ message: err.message });
    }
}
module.exports={execution}