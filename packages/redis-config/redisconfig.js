require('dotenv').config();
const {createClient}=require('redis');
const logger=require('@codekro/logger');

    const REDIS_URL=process.env.REDIS_URL;
    if(!REDIS_URL){
     logger.error("REDIS_URL is not defined");
     throw new Error("REDIS_URL is not defined");
    }
    const client =createClient({
        url:REDIS_URL
    });
    client.on("error", (error) => {
    logger.error(`Redis connection error: ${error.message}`);
});
    const connectredis=async()=>{
        if(!client.isOpen){
            await client.connect();
        }
    }
    client.on('connect',()=>{
    logger.info("Redis connected");
    })

    const updateCachedProblemState=async(userId,problemId,updates)=>{
        const key=`problem:${userId}`;
        const items=await client.lRange(key,0,-1);
        if(items.length===0) return false;

        const ttl=await client.ttl(key);
        const updatedItems=items.map((item)=>{
            try {
                const problem=JSON.parse(item);
                if(String(problem._id)===String(problemId)){
                    Object.assign(problem,updates);
                }
                return JSON.stringify(problem);
            } catch (error) {
                return item;
            }
        });

        const transaction=client.multi();
        transaction.del(key);
        transaction.rPush(key,updatedItems);
        if(ttl>0) transaction.expire(key,ttl);
        await transaction.exec();
        return true;
    };

    const SOLUTION_CACHE_TTL_SECONDS=30*24*60*60;
    const solutionKey=(userId,problemId)=>`solution:${userId}:${problemId}`;

    const getCachedSolution=async(userId,problemId)=>{
        const raw=await client.get(solutionKey(userId,problemId));
        if(!raw) return null;

        try {
            return JSON.parse(raw);
        } catch (error) {
            await client.del(solutionKey(userId,problemId)).catch(()=>undefined);
            return null;
        }
    };

    const setCachedSolution=async(userId,problemId,solution)=>{
        await client.set(
            solutionKey(userId,problemId),
            JSON.stringify(solution),
            {EX:SOLUTION_CACHE_TTL_SECONDS}
        );
        return true;
    };


    module.exports={client,connectredis,updateCachedProblemState,getCachedSolution,setCachedSolution}
