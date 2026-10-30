const logger = require("@codekro/logger");
const {client}=require("@codekro/redis-config");
const {problem}=require('@codekro/db_config');

const HISTORY_LIMIT=100;
const HISTORY_TTL_SECONDS=30*24*60*60;

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
            await client.lTrim(`problem:${user_id}`,-HISTORY_LIMIT,-1);
            await client.expire(`problem:${user_id}`,HISTORY_TTL_SECONDS);
            logger.info("Problem fetched", Problem);
            return res.status(200).json({
                message: "Problem fetched",
                problem: Problem.slice(-HISTORY_LIMIT).reverse().map(item => JSON.parse(item))
            });
        }
        logger.error("Cache miss");
        const getProblemFromDB=await problem.find({user_id}).sort({createdAt:-1,_id:-1});
        if(getProblemFromDB.length>0)
        {
            const cacheItems=getProblemFromDB.slice(0,HISTORY_LIMIT);
            const cache=client.multi();
            for(const item of cacheItems.slice().reverse()){
                cache.rPush(`problem:${user_id}`,JSON.stringify(item));
            }
            cache.lTrim(`problem:${user_id}`,-HISTORY_LIMIT,-1);
            cache.expire(`problem:${user_id}`,HISTORY_TTL_SECONDS);
            await cache.exec();
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
