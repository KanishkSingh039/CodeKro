require('dotenv').config();
const nodemailer=require("nodemailer");
const logger=require("@codekro/logger")
const {client}=require("@codekro/redis-config");
const transporter=nodemailer.createTransport({
    host:process.env.EMAIL_HOST,
    port:process.env.EMAIL_PORT,
    secure:process.env.EMAIL_SECURE,
    auth:{
        user:process.env.EMAIL_USER,
        pass:process.env.EMAIL_PASS
    }
});
const OTP_GENERATOR=async(req,res)=>{
    try{
    const {email}=req.body;
    if(!email)
    {
        logger.error("Email is empty ");
        return res.status(400).json({ message: "Bad Request" });
    }
    const otp=Math.floor(100000+Math.random()*900000);
    const mailOptions={
        from:process.env.EMAIL_USER,
        to:email,
        subject:"OTP for password change",
        text:`Your OTP is ${otp}`
    }
    await transporter.sendMail(mailOptions);
    client.set(`otp : ${email}`,otp,{EX:60*5});
    return res.status(200).json({ message: "OTP sent successfully", otp });
    }
    catch(error){
        logger.error("Failed to send OTP", error.stack);
        return res.status(500).json({ message: error.message });
    }
}
const OTP_VERIFY=async(req,res)=>{
    try{
        const {email,otp}=req.body;
        if(!email || !otp)
        {
            logger.error("Email or OTP is empty ");
            return res.status(400).json({ message: "Bad Request" });
        }
        const storedOTP=client.get(`otp : ${email}`);
        if(!storedOTP)
        {
            logger.error("OTP is expired");
            return res.status(400).json({ message: "OTP is expired" });
        }
        if(storedOTP!==otp)
        {
            logger.error("Invalid OTP");
            return res.status(400).json({ message: "Invalid OTP" });
        }
        return res.status(200).json({ message: "OTP verified successfully" });
    }
    catch(error){
        logger.error("Failed to verify OTP", error.stack);
        return res.status(500).json({ message: error.message });
    }
}

module.exports={OTP_GENERATOR,OTP_VERIFY}