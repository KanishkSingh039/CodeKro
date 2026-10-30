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

app.use("/execution",executionRouter);
app.get("/execution/health", (req, res) => {
    console.log(`Health request received on port ${PORT}`);

    res.status(200).json({
        service: "execution-service",
        status: "OK",
        instance: PORT
    });
});

const start = async () => {
    try {
        await connectToMongo();
        await connectredis();
        const worker=await executionWorker();
        if(worker && typeof worker?.waitUntilReady === 'function'){
            await worker.waitUntilReady();
            logger.info("execution worker is ready");
        }
        app.listen(PORT,()=>{
            logger.info(`execution server running at the PORT:${PORT}`)
        });
    } catch (err) {
        logger.error(`Execution service failed to start: ${err.stack || err.message || String(err)}`);
        process.exit(1);
    }
};

start();
