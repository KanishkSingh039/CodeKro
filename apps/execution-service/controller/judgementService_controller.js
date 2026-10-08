const {prompt}=require("../Judgement_Service/prompt");
const {LLM_service}=require("../Judgement_Service/llm");
const logger = require("@codekro/logger");


const judgementService=async(output,test_case,code,language)=>{
    try {
        const llm_prompt=prompt(output,test_case,code,language);
        const judgement=await LLM_service(llm_prompt);
        return judgement;
        
    } catch (error) {
        logger.error("Judgement service failed", error.message);
        return error.message;
    }
}
module.exports={judgementService}