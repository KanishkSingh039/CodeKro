require("dotenv").config();
const {Queue}=require("bullmq");
const {io_client}=require("@codekro/io-redis-config");
const IOQueue=(queue_name)=>{
    const queue=new Queue(queue_name,{
        connection:io_client
    })
    return queue;
}
module.exports={IOQueue}