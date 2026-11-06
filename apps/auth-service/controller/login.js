const bcrypt=require('bcrypt');
const CodeKroUser=require('../schema/register')
const logger=require('@codekro/logger');
const jwt=require('jsonwebtoken');  
const {client}=require('@codekro/redis-config');
const {setAuthCookie}=require('@codekro/authentication-middleware');

// DUMMY_HASH is used to run a constant-time bcrypt.compare even when the
// email doesn't exist, preventing user-enumeration via timing side-channel.
//
// Computed once at startup using bcrypt.hash() (async, non-blocking) and
// stored in a module-level Promise resolved before the first request is
// served. bcrypt.hashSync() was removed because it blocks the entire
// event loop during module load — before Redis/Mongo are even connected.
const DUMMY_HASH_PROMISE = bcrypt.hash("__codekro_dummy_password__", 10);

const login=async(req,res)=>{
    const {email,password}=req.body;
    if(!email || !password){
     return res.status(400).json({message:"All mentioned fields are required"});   
    }
    const checkemail=await CodeKroUser.findOne({email});
    // Await the dummy hash Promise — it resolves instantly after the first call
    // since the Promise is already settled by the time any request arrives.
    const DUMMY_HASH = await DUMMY_HASH_PROMISE;
    const checkpassword=await bcrypt.compare(password, checkemail?.password || DUMMY_HASH);
    if(!checkemail || !checkpassword){
        return res.status(401).json({message:"Invalid email or password"});
    }
    logger.info("Login successfully",checkemail);
    const token=jwt.sign({
        id:checkemail._id,
        email:checkemail.email,
        username:checkemail.username,
        name:checkemail.name,
        picture:checkemail.picture || "",
        googlelogin:false,
        
    },process.env.JWT_SECRET,{expiresIn:"1h"});
    await client.set(`${checkemail.email}`,JSON.stringify({
        user:checkemail.username,
        email:checkemail.email,
        token
    }));
    setAuthCookie(res,token);
    return res.status(200).json({message:"Login successfully",user:checkemail.username,email:checkemail.email,token});   
}
module.exports={login};