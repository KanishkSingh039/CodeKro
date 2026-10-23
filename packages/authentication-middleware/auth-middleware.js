require("dotenv").config();
const jwt=require("jsonwebtoken");
const logger=require("@codekro/logger");
const {OAuth2Client}=require('google-auth-library');
const authenticate=async (req,res,next)=>{
    try {
    const client_id=process.env.GOOGLE_CLIENT_ID;
    const client_secret=process.env.GOOGLE_CLIENT_SECRET;
    const redirect_uri=process.env.GOOGLE_REDIRECT_URI;
    if(!client_id ||!client_secret ||!redirect_uri){
        logger.error("Google credentials not defined");
        return res.status(500).json({message:"Google credentials not defined"});
    }
    const OAuthclient=new OAuth2Client({
        client_id,
        client_secret,
        redirect_uri
    })
    const token=req.headers.authorization;
    if(!token || !token.startsWith('Bearer ')){
            return res.status(401).json({
                message:"No token provided"
            })
        }
    const JWTtoken=token.split(' ')[1];
    
    if(!JWTtoken){
        logger.error("Token not found");
        return res.status(401).json({
            message:"Token not found"
        })
    }
    try {
        const UserDetailsThroughToken=jwt.verify(JWTtoken,process.env.JWT_SECRET);
    if(UserDetailsThroughToken.googlelogin)
    {
    const GoogleAuthtoken=req.headers.googleauthtoken;
    if(!GoogleAuthtoken){
        return res.status(401).json({
            message:"No google auth token provided"
        })
    }
    try {
        const tokeninfo= await OAuthclient.getTokenInfo(GoogleAuthtoken);
        
        if(!tokeninfo){
            return res.status(401).json({
                message:"Invalid google auth token"
            })
        }
    } catch (error) {
        return res.status(401).json({
            message:"Invalid google auth token"
        })
    }
    }
    
    req.user=UserDetailsThroughToken;
    return next();
    } catch (error) {
        return res.status(401).json({
            message:"Invalid token"
        })
    }
    
        
    } catch (error) {
        return res.status(500).json({message:error.message});
    }
}
module.exports={authenticate};