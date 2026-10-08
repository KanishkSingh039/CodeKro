const logger = require("@codekro/logger");
const {LLM_service}=require("../AI_service/LLm");
const {prompt}=require("../AI_service/prompt");
const problemSchema=require("../schema/problem")
const {client}=require("@codekro/cache_config")
const AI_serviceController=async(req,res)=>{
    try {
        const {user_id,service}=req.body;
        if(!user_id||!service)
        {
            logger.error("User_id/service is empty ")
            return res.status(400).json({ message: "Bad Request" });
        }
        const problem=await LLM_service(prompt(service));
        logger.info("Problem generated", problem);
        const SaveProblemAtDB=await problemSchema.create({
            user_id:user_id,
            title:problem.title,
            description:problem.description,
            test_case:problem.test_case,
            difficulty:problem.difficulty
        })
        await client.LPUSH(`problem:${SaveProblemAtDB._id}`,JSON.stringify(SaveProblemAtDB));
        logger.info("Problem saved to database", SaveProblemAtDB);
        return res.status(200).json({ message: "Problem generated", SaveProblemAtDB });
    } catch (error) {
        logger.error("Failed to generate problem", error.message);
        res.status(500).json({ message: error.message });
    }
}
module.exports=AI_serviceController;