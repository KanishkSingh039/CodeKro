const bcrypt=require('bcrypt');
const CodeKroUser=require('../schema/register')
const logger=require('@codekro/logger');
const jwt=require('jsonwebtoken');  
const {client}=require('@codekro/redis-config');

const login=async(req,res)=>{
    const {email,password}=req.body;
    if(!email || !password){
     logger.error("All mentioned fields are required");
     return res.status(400).json({message:"All mentioned fields are required"});   
    }
    const checkemail=await CodeKroUser.findOne({email});
    if(!checkemail){
     logger.error("Email not found");
     return res.status(404).json({message:"Email not found"});   
    }
    const checkpassword=await bcrypt.compare(password,checkemail.password);
    if(!checkpassword){
        logger.error("Invalid password");
        return res.status(401).json({message:"Invalid password"});
    }
    logger.info("Login successfully",checkemail);
    const token=jwt.sign({
        id:checkemail._id,
        email:checkemail.email,
        username:checkemail.username,
        name:checkemail.username,
        googlelogin:false,
        
    },process.env.JWT_SECRET,{expiresIn:"1h"});
    await client.set(`${checkemail.email}`,JSON.stringify({
        user:checkemail.username,
        email:checkemail.email,
        token
    }));
    return res.status(200).json({message:"Login successfully",user:checkemail.username,email:checkemail.email,token});   
}
module.exports={login};