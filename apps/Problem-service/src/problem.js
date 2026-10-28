require('dotenv').config();
const logger = require('@codekro/logger');
const express = require('express');
const router = require('../routes/problem_router.js');
const {connectredis}=require("@codekro/redis-config");
const problemfetchrouter=require('../routes/FetchProblem.js')
const {connectToMongo}=require("@codekro/db_config");
const {problemgeneratorWorker}=require("../controller/problemGeneratorWorker.js");
const app = express();
app.use(express.json());
const PORT = process.env.PORT || 5000;
await connectredis().catch((err)=>{
    logger.error("Failed to connect to Redis",err.message);
    throw err;
});
await connectToMongo().catch((err)=>{
    logger.error("Failed to connect to MongoDB",err.message);
    throw err;
});
const worker=await problemgeneratorWorker();
if(worker && typeof worker?.waitUntilReady === 'function'){
    await worker?.waitUntilReady().catch((err)=>{
        logger.error("Failed to start worker",err.message);
        throw err;
    });
    logger.info("problem worker is ready")
}
app.use("/problem", router);
app.use("/problem",problemfetchrouter);
app.get("/problem/health", (req, res) => {
    console.log(`Health request received on port ${PORT}`);

    res.status(200).json({
        service: "problem-service",
        status: "OK",
        instance: PORT
    });
});
const server=app.listen(PORT, () => {
    logger.info(`Problem service is running on port ${PORT}`);
})
server.on("error", (error) => {
    console.error("SERVER ERROR:", error);
});

server.on("close", () => {
    console.log("SERVER CLOSED");
});