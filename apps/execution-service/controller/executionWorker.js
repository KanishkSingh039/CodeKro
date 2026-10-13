const {dockerExecutor}=require("./dockerExecutor");
const {judgementService}=require("./judgementService_controller");
const {client}=require("@codekro/redis-config");
const Solution=require("@codekro/db_config").Solution;
const logger=require("@codekro/logger");
const executionWorker=async()=>{
    const consumer=client.duplicate();
    try {
        await consumer.connect();
        // const length=await consumer.lLen("problem-queue");
        const data=await consumer.lRange("problem-queue",0,-1);
        data?.map(async ()=>{
        const details=await consumer.rPop("problem-queue",0);
            if(!details)
            {
                logger.error("No problem found for user", details);
                return;
            }
            const {code,language,input,user,problem,test_case}=JSON.parse(details);
            try {
                const {output,error}=await dockerExecutor(language,input,code,problem);
                    
                    const judgement=await judgementService(output,test_case,code,language);
                    const StoreSolutionInDB= await Solution.create({
                        user_id:user,
                        problem_id:problem,
                        language:language,
                        code:code,
                        input:input,
                        output:output,
                        error:error,
                        judgement:judgement
                    });
                    await client.lPush(`solution : ${user}:${problem}`,JSON.stringify(StoreSolutionInDB));
             
               
            } catch (error) {
                logger.error(`job failed ${error.stack}`);
                
            }
            
        });
    }        
    finally{
        await consumer.quit()
    }
    }

module.exports={executionWorker}