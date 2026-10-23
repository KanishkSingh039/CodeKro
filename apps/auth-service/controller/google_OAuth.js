require('dotenv').config();
const logger=require('@codekro/logger');
const {OAuth2Client}=require('google-auth-library');
const {client}=require('@codekro/redis-config');
const CodeKroUser=require('../schema/register');
const jwt=require('jsonwebtoken');
const googleauthclient= async()=>{
    try {
        const client_id=process.env.GOOGLE_CLIENT_ID;
    const client_secret=process.env.GOOGLE_CLIENT_SECRET;
    const redirectUri=process.env.GOOGLE_REDIRECT_URI;
    if(!client_id ||!client_secret ||!redirectUri){
        logger.error("Google credentials not defined");
        return { message: "Google credentials not defined" };
    }
    const Oauthclient=new OAuth2Client({
        client_id,
        client_secret,
        redirectUri
    });
    return Oauthclient;
    } catch (error) {
        logger.error("Failed to create google auth client", error);
        throw error;
    }
}
const RedirectToGoogleAuth=async(req,res)=>{
 try {
    const OAuthclient=await googleauthclient();
    const url=OAuthclient.generateAuthUrl({
        access_type:"offline",
        prompt:"consent",
        scope:["openid","email","profile"]
    });
    return res.redirect(url);
    
 } catch (error) {
    return res.status(500).json({ message: error });
 }   
};

const GoogleAuthCallback=async(req,res)=>{
    try {
        const {code,error}=req.query;
        if(error){
            logger.error("Error in google auth callback", error);
            return res.status(400).json({ message: "Error in google auth callback" });
        }
        if(!code){
            logger.error("Code not found");
            return res.status(400).json({ message: "Code not found" });
        }
        const OAuthclient=await googleauthclient();
        if(!OAuthclient){
            logger.error("Client not found");
            return res.status(400).json({ message: "Client not found" });
        }
        const {tokens}=await OAuthclient.getToken(code.toString());
        const verifytokenid=await OAuthclient.verifyIdToken({
            idToken: tokens.id_token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload=verifytokenid.getPayload();
        const tokeninfo=await OAuthclient.getTokenInfo(tokens.access_token);
        const checktheexistinguserwiththisemail=await CodeKroUser.find({email:tokeninfo.email});
        if(!checktheexistinguserwiththisemail.length){
            const jwtToken= jwt.sign({
                email:payload.email,
                username:payload.name,
                picture:payload.picture,
            },process.env.JWT_SECRET,{expiresIn:"1h"})
            client.set(tokeninfo.email,JSON.stringify(jwtToken))
            const Addtheusertodb=await CodeKroUser.create({
                email:payload.email,
                username:payload.name,
                name:payload.name,
                picture:payload.picture,
            });
            console.log(Addtheusertodb);
            
            return res.status(200).json({ message: "Google auth tokens",user:{
                id:Addtheusertodb._id,
                username:Addtheusertodb.username,
                name:payload.name,
                email:payload.email,
                picture:payload.picture,
            } });
        }
        return res.status(200).json({ message: "Google auth tokens",user:{
                id:checktheexistinguserwiththisemail._id,
                name:checktheexistinguserwiththisemail.name,
                username:checktheexistinguserwiththisemail.username,
                email:checktheexistinguserwiththisemail.email,
                picture:checktheexistinguserwiththisemail.picture,
            } });
    } catch (error) {
        logger.error("Failed to google auth callback", error);
        return res.status(500).json({ message: error });
    }
};
module.exports={RedirectToGoogleAuth,GoogleAuthCallback};