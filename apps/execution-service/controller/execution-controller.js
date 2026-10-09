const logger = require("@codekro/logger");
const fs=require("fs");
const path=require("path");
const {judgementService}=require("./judgementService_controller");
const { dockerExecutor } = require("./dockerExecutor");
const { client } = require("../../../packages/redis-config/redisconfig");
const Solution=require("@codekro/db_config").Solution;
const execution = async (req, res) => {
    try {
        const {user_id, problem_id, code, language, input ,test_case } = req.body;
        if (!code || !language || !input)
            return res.status(400).json({ message: "Bad Request" });
        await client.lPush("problem-queue",JSON.stringify({
            code:code,
            language:language,
            input:input,
            test_case:test_case,
            user:req.user_id,
            problem:req.problem_id,
        }));
        
        const {output,error}=await dockerExecutor(language,input,code);
        
        const judgement=await judgementService(output,test_case,code,language);
        const StoreSolutionInDB= await Solution.create({
            user_id:user_id,
            problem_id:problem_id,
            language:language,
            code:code,
            input:input,
            output:output,
            error:error,
            judgement:judgement
        });
        client.lPush("solutions",JSON.stringify(StoreSolutionInDB));
        
        return res.status(200).json({ message: "Execution successful", output:output.trim(), judgement:judgement , error:error.trim(), Solution:StoreSolutionInDB });
    }
    catch(err)
    {
        logger.error("Execution failed", err.message);
        return res.status(500).json({ message: err.message });
    }
}
module.exports={execution}