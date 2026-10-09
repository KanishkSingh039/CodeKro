require("dotenv").config();
const express=require("express");
const logger=require("@codekro/logger");
const executionRouter=require("../routes/execution-router");
const {connectredis}=require("@codekro/redis-config");
const {connectToMongo}=require("@codekro/db_config");
const app=express();
app.use(express.json());
const PORT=process.env.PORT;
app.use("/execution",executionRouter);
connectToMongo();
connectredis();
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
