const logger = require("@codekro/logger");
const {client}=require("@codekro/redis-config");
const {problem}=require('@codekro/db_config');

const fetch_problem=async(req,res)=>{
    try {
        const user_id=req.user.id;
        if(!user_id)
        {
            logger.error("User_id is empty ")
            return res.status(400).json({ message: "Bad Request" });
        }
        const Problem=await client.lRange(`problem:${user_id}`,0,-1);
        if(Problem.length > 0)
        {
            logger.info("Problem fetched", Problem);
            return res.status(200).json({
                message: "Problem fetched",
                problem: Problem.map(item => JSON.parse(item))
            });
        }
        logger.error("Cache miss");
        const getProblemFromDB=await problem.find({user_id});
        if(getProblemFromDB.length>0)
        {
            await Promise.all(getProblemFromDB.map(item =>
                client.rPush(`problem:${user_id}`,JSON.stringify(item))
            ));
        }
        else{
            logger.error("No problem found for user", user_id);
            return res.status(404).json({ message: "No problem found" });
        }
        return res.status(200).json({ message: "Problem fetched", problem: getProblemFromDB });
    } catch (error) {
        logger.error("Failed to fetch problem", error.message);
        res.status(500).json({ message: error.message });
    }
}
module.exports=fetch_problem
