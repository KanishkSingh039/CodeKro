require('dotenv').config();
const logger=require('@codekro/logger');
const {OAuth2Client}=require('google-auth-library');
const googleauthclient= async()=>{
    try {
        const client_id=process.env.GOOGLE_CLIENT_ID;
    const client_secret=process.env.GOOGLE_CLIENT_SECRET;
    const redirectUri=process.env.GOOGLE_REDIRECT_URI;
    if(!client_id ||!client_secret ||!redirectUri){
        logger.error("Google credentials not defined");
        return { message: "Google credentials not defined" };
    }
    const client=new OAuth2Client({
        client_id,
        client_secret,
        redirectUri
    });
    return client;
    } catch (error) {
        logger.error("Failed to create google auth client", error);
        throw error;
    }
}
const RedirectToGoogleAuth=async(req,res)=>{
 try {
    const client=await googleauthclient();
    const url=client.generateAuthUrl({
        access_type:"offline",
        prompt:"consent",
        scope:["openid","email","profile"]
    });
    logger.info(`Google auth url : ${url}`);
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
        logger.info("Google auth code : ",code.toString());
        const client=await googleauthclient();
        if(!client){
            logger.error("Client not found");
            return res.status(400).json({ message: "Client not found" });
        }
        logger.info(`Google auth code : ${code.toString()}`);
        const {tokens}=await client.getToken(code.toString());
        logger.info(`Google auth tokens : ${JSON.stringify(tokens)}`);
        return res.status(200).json({ message: "Google auth tokens", tokens });
    } catch (error) {
        logger.error("Failed to google auth callback", error);
        return res.status(500).json({ message: error });
    }
};
module.exports={RedirectToGoogleAuth,GoogleAuthCallback};