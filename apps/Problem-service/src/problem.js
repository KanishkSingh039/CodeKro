const logger=require('@codekro/logger');
const FetchProblems=async (req,res)=>{
    try {
        
    } catch (error) {
        logger.error(error.message);
        return res.status(500).json({message:"Internal server error"});
    }
}
module.exports={FetchProblems}