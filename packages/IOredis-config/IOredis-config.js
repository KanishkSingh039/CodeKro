require("dotenv").config();
const Redis=require("ioredis");
const logger=require("@codekro/logger");
const IO_REDIS_URL=process.env.IO_REDIS_URL;
if(!IO_REDIS_URL){
 logger.error("IO_REDIS_URL is not defined");
 throw new Error("IO_REDIS_URL is not defined");
}
const io_client=new Redis(IO_REDIS_URL,{
    maxRetriesPerRequest:null,
});
io_client.on("connect",()=>{
 logger.info("IO Redis connected");
});
io_client.on("error",(error)=>{
 logger.error(`IO Redis connection error: ${error.message}`);
});
module.exports={io_client}

