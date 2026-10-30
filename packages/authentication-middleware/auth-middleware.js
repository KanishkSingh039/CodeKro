require("dotenv").config();
const jwt=require("jsonwebtoken");

const authenticate=(req,res,next)=>{
    const token=req.headers.authorization;
    if(!token || !token.startsWith('Bearer ')){
        return res.status(401).json({
            message:"No token provided"
        })
    }
    const JWTtoken=token.slice(7).trim();
    if(!JWTtoken){
        return res.status(401).json({
            message:"No token provided"
        })
    }
    try {
        req.user=jwt.verify(JWTtoken,process.env.JWT_SECRET);
        return next();
    } catch (error) {
        return res.status(401).json({
            message:"Invalid or expired token"
        })
    }
}
module.exports={authenticate};
