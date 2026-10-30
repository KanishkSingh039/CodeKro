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

const start = async () => {
    try {
        await connectredis();
        await connectToMongo();
        const worker=await problemgeneratorWorker();
        if(worker && typeof worker?.waitUntilReady === 'function'){
            await worker.waitUntilReady();
            logger.info("problem worker is ready");
        }
        const server=app.listen(PORT, () => {
            logger.info(`Problem service is running on port ${PORT}`);
        });
        server.on("error", (error) => {
            logger.error(`SERVER ERROR: ${error.stack || error.message}`);
        });
        server.on("close", () => {
            logger.info("SERVER CLOSED");
        });
    } catch (err) {
        logger.error(`Problem service failed to start: ${err.stack || err.message || String(err)}`);
        process.exit(1);
    }
};

start();