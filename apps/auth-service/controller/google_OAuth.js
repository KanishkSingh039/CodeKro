require('dotenv').config();
const logger=require('@codekro/logger');
const {OAuth2Client}=require('google-auth-library');
const {client}=require('@codekro/redis-config');
const {setAuthCookie}=require('@codekro/authentication-middleware');
const CodeKroUser=require('../schema/register');
const jwt=require('jsonwebtoken');
const googleauthclient = () => {

    const {
        GOOGLE_CLIENT_ID,
        GOOGLE_CLIENT_SECRET,
        GOOGLE_REDIRECT_URI
    } = process.env;

    if (!GOOGLE_CLIENT_ID ||
        !GOOGLE_CLIENT_SECRET ||
        !GOOGLE_REDIRECT_URI) {

        throw new Error("Google OAuth credentials missing");
    }

    return new OAuth2Client({
        clientId: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        redirectUri: GOOGLE_REDIRECT_URI
    });
};
const redirectToFrontend = (res, token) => {
    const destination = process.env.GOOGLE_SUCCESS_REDIRECT || '/dashboard';
    setAuthCookie(res, token);
    res.set('Cache-Control', 'no-store');
    return res.redirect(destination);
};

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
        const checktheexistinguserwiththisemail=await CodeKroUser.findOne({email:tokeninfo.email});
        if(!checktheexistinguserwiththisemail){
            const Addtheusertodb=await CodeKroUser.create({
                email:payload.email,
                username:payload.name,
                name:payload.name,
                picture:payload.picture,
            });
            console.log(Addtheusertodb);
            const jwtToken= jwt.sign({
                id:Addtheusertodb._id,
                email:payload.email,
                username:payload.name,
                name:payload.name,
                picture:payload.picture,
            },process.env.JWT_SECRET,{expiresIn:"1h"})
            await client.set(tokeninfo.email,JSON.stringify({
                JWTtoken:jwtToken,
                GoogleAuthtoken:tokens,
            }));
            
            return redirectToFrontend(res, jwtToken);
        }
        const jwtToken= jwt.sign({
            id:checktheexistinguserwiththisemail._id,
            name:checktheexistinguserwiththisemail.name,
            username:checktheexistinguserwiththisemail.username,
            email:checktheexistinguserwiththisemail.email,
            picture:checktheexistinguserwiththisemail.picture,
            googlelogin:true
    },process.env.JWT_SECRET,{expiresIn:"1h"})
        return redirectToFrontend(res, jwtToken);
    } catch (error) {
        logger.error("Failed to google auth callback", error);
        return res.status(500).json({ message: error });
    }
};
module.exports={RedirectToGoogleAuth,GoogleAuthCallback};
