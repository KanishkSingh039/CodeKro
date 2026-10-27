require("dotenv").config();
const {Queue}=require("bullmq");
const {io_client}=require("@codekro/io-redis-config");
const IOQueue=(queue_name)=>{
    const queue=new Queue(queue_name,{
        connection:io_client,
        defaultJobOptions: {
        attempts: 3,

        backoff: {
            type: "exponential",
            delay: 1000
        },

        removeOnComplete: {
            count: 1000
        },

        removeOnFail: {
            age: 24 * 3600,
            count: 5000
        }
    }
    })
    return queue;
}
module.exports={IOQueue}