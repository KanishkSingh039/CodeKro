require('dotenv').config();
const express=require("express");
const logger=require('@codekro/logger');
const {connectredis}=require('@codekro/redis-config');
const {connectToMongo}=require('@codekro/db_config');
const app=express();
const registerRoute=require("../routes/register");
const loginRoute=require("../routes/login");
const otpRoute=require('../routes/Otp_router');
app.use(express.json());
app.use("/auth",registerRoute);
app.use("/auth",loginRoute);
app.use("/auth",otpRoute);
await connectredis().then(()=>{
    logger.info("Redis connected");
}).catch((err)=>{
    logger.error(err);
    throw err;
});
await connectToMongo().catch((err)=>{
    logger.error(err);
    throw err;
});

const PORT = process.env.PORT || 3011;

app.get("/auth/health", (req, res) => {
    console.log(`Health request received on port ${PORT}`);

    res.status(200).json({
        service: "auth-service",
        status: "OK",
        instance: PORT
    });
});

app.listen(process.env.PORT,()=>{
    logger.info(`Auth service started on port ${process.env.PORT}`);
})
module.exports=app;
