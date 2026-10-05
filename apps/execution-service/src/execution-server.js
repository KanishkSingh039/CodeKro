require("dotenv").config();
const express=require("express");
const logger=require("@codekro/logger");
const app=express();
app.use(express.json());
app.listen(process.env.PORT,()=>{
    logger.info(`execution server running at the PORT:${process.env.PORT}`)
})