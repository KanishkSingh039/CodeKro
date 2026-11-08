const {problem}=require("@codekro/db_config");
const logger=require("@codekro/logger");
const {client,updateCachedProblemState}=require("@codekro/redis-config");

const bookmarkUpdate=async(req,res)=>{
    const userId=req.user?.id;
    const {problemId}=req.params;
    const {bookmarked}=req.body;

    if(!userId || !problemId || typeof bookmarked!=="boolean"){
        return res.status(400).json({message:"problemId and a boolean bookmarked value are required"});
    }

    try {
        const updatedProblem=await problem.findOneAndUpdate(
            {_id:problemId,user_id:String(userId)},
            {$set:{bookmarked}},
            {new:true}
        );

        if(!updatedProblem){
            return res.status(404).json({message:"Problem not found"});
        }

        try {
            await updateCachedProblemState(String(userId),String(problemId),{bookmarked});
        } catch (error) {
            logger.error(`Failed to update bookmark cache: ${error.message}`);
            await client.del(`problem:${userId}`).catch(()=>undefined);
        }

        return res.status(200).json({message:"Bookmark updated",problem:updatedProblem});
    } catch (error) {
        logger.error(`Failed to update bookmark: ${error.message}`);
        return res.status(500).json({message:"Failed to update bookmark"});
    }
};

module.exports={bookmarkUpdate};
