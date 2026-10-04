require('dotenv').config();
const logger = require('@codekro/logger');
const express = require('express');
const router = require('../routes/problem_router.js');
const app = express();
app.use(express.json());
const PORT = process.env.PORT || 5000;
app.use("/problem", router);
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