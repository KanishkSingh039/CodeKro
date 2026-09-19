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


module.exports={client,connectredis}