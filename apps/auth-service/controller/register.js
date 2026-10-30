const logger=require('@codekro/logger');
const bcrypt=require('bcrypt');
const CodeKroUser = require('../schema/register');
const register=async(req,res)=>{
    try {
        const {name,email,username,password}=req.body;
        if(!name || !email || !username || !password){
            logger.error("All fields are required");
            return res.status(400).json({message:"All fields are required"});
        }
        const checkemailexist=await CodeKroUser.findOne({email});
        if(checkemailexist){
            return res.status(400).json({message:"Email already exists"});
        }
        const checkusernameexist=await CodeKroUser.findOne({username});
        if(checkusernameexist){
            return res.status(400).json({message:"Username already exists"});
        }
        const salt=await bcrypt.genSalt(10);
        const hashepassword=await bcrypt.hash(password,salt);
        const user=await CodeKroUser.create({
            name,
            email,
            username,
            password:hashepassword,
        });
        logger.info(`User created successfully ${{user:{
            user_id:user._id,
            name:user.name,
            email:user.email,
            username:user.username,
        }}}`)
        return res.status(201).json({message:"User created successfully",user:{
            user_id:user._id,
            name:user.name,
            email:user.email,
            username:user.username,
        }});
    } catch (error) {
        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern || {})[0] || "Field";
            return res.status(409).json({ message: `${field} already exists` });
        }
        if (error.name === "ValidationError") {
            const firstError = Object.values(error.errors)[0];
            return res.status(400).json({ message: firstError?.message || "Invalid input" });
        }
        logger.error(error.message)
        return res.status(500).json({message:"Internal server error"});
    }
}

module.exports={register};
