const logger = require("@codekro/logger");
const {client}=require("@codekro/redis-config");
const Problem=require('../schema/problems');
const fetch_problem=async(req,res)=>{
    try {
        const {user_id}=req.body;
        if(!user_id)
        {
            logger.error("User_id is empty ")
            return res.status(400).json({ message: "Bad Request" });
        }
        const problem=await client.lRange(`problem:${user_id}`,0,-1);
        if(!problem)
        {
            logger.error("Cache miss");
            const getProblemFromDB=await Problem.find({user_id});
            if(!getProblemFromDB)
            {
                logger.error("No problem found for user", user_id);
                return res.status(404).json({ message: "No problem found" });
            }
            await client.LPUSH(`problem:${user_id}`,JSON.stringify(getProblemFromDB));
            return res.status(200).json({ message: "Problem fetched", problem:getProblemFromDB });
        }
        logger.info("Problem fetched", problem);
        return res.status(200).json({ message: "Problem fetched", problem });
    } catch (error) {
        logger.error("Failed to fetch problem", error.message);
        res.status(500).json({ message: error.message });
    }
}
module.exports=fetch_problem