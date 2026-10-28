require("dotenv").config();
const express=require("express");
const logger=require("@codekro/logger");
const executionRouter=require("../routes/execution-router");
const {connectredis}=require("@codekro/redis-config");
const {connectToMongo}=require("@codekro/db_config");
const {executionWorker}=require("../controller/executionWorker");
const app=express();
app.use(express.json());
const PORT=process.env.PORT;
await connectToMongo().catch((err)=>{
    logger.error("Failed to connect to MongoDB",err.message);
    throw err;
});
await connectredis().catch((err)=>{
    logger.error("Failed to connect to Redis",err.message);
    throw err;
});
const worker=await executionWorker();
if(worker && typeof worker?.waitUntilReady === 'function'){
    await worker?.waitUntilReady();
    logger.info("execution worker is ready")
}
app.use("/execution",executionRouter);
app.get("/execution/health", (req, res) => {
    console.log(`Health request received on port ${PORT}`);

    res.status(200).json({
        service: "execution-service",
        status: "OK",
        instance: PORT
    });
});
app.listen(PORT,()=>{
    logger.info(`execution server running at the PORT:${PORT}`)
})
