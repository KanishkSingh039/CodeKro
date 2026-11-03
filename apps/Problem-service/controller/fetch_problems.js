const logger = require("@codekro/logger");
const {getProblemHistory}=require("../history/problemHistory");

const fetch_problem=async(req,res)=>{
    try {
        const user_id=req.user?.id;
        if(!user_id)
        {
            logger.error("User_id is empty ")
            return res.status(400).json({ message: "Bad Request" });
        }

        const problems=await getProblemHistory(user_id);
        if(problems.length===0)
        {
            logger.error("No problem found for user", user_id);
            return res.status(404).json({ message: "No problem found" });
        }

        return res.status(200).json({ message: "Problem fetched", problem: problems });
    } catch (error) {
        logger.error(`Failed to fetch problem: ${error.message}`);
        return res.status(500).json({ message: "Failed to fetch problem" });
    }
}
module.exports=fetch_problem
