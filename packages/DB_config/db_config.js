require('dotenv').config();
const mongoose=require('mongoose');
const logger=require('@codekro/logger');
const Solution=require("./Schemas/Solution");
const problem=require("./Schemas/problem");
const connectToMongo=async()=>{
    const MONGO_URL=process.env.MONGO_URL;
    if(!MONGO_URL){
        logger.error("MONGO_URL is not defined");
        throw new Error("MONGO_URL is not defined");
    }
    mongoose.connect(MONGO_URL).then(()=>{
        logger.info("Database connected");
    }).catch((err)=>{
        logger.error(err);
        throw err;
    })
}

module.exports={mongoose,connectToMongo,Solution,problem};