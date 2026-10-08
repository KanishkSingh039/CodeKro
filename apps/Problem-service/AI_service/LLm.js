const logger = require("@codekro/logger");
const { GoogleGenAI } = require("@google/genai");
const LLM_service=async(prompt)=>{
    try {
        const client=new GoogleGenAI({
            apiKey:process.env.API_KEY,
            
        })
        const res=await client.models.generateContent({
            
                model:process.env.MODEL,
                contents:[
                    {
                        role:"user",
                        parts:[
                            {
                                text:prompt
                            }
                        ]
                    }
                ]
            }
        )
        logger.info("Problem", res.text);
        return JSON.parse(res.text)||null;
    } catch (error) {
        // logger.error("Failed to generate problem", error.message);
        // return error.message;
        console.log("========== OPENROUTER ERROR ==========");
        console.log("NAME:", error.name);
        console.log("MESSAGE:", error.message);
        console.log("CAUSE:", error.cause);
        console.dir(error, { depth: null });
        console.log("======================================");

        logger.error(
            "Failed to generate problem",
            error.message
        );

        throw error;
    }
}
module.exports={LLM_service}