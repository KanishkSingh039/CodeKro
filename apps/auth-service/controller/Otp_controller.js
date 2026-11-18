require('dotenv').config();
const nodemailer=require("nodemailer");
const logger=require("@codekro/logger")
const {client}=require("@codekro/redis-config");
const SMTP_PORT=Number(process.env.SMTP_PORT);
const normalizeOtp=(value)=>{
    if(value === null || value === undefined) return "";
    try {
        const parsed=JSON.parse(value);
        if(parsed !== null && typeof parsed !== "object") return String(parsed);
    } catch (error) {
        // Values written before JSON serialization was removed are plain digits.
    }
    return String(value);
};
const transporter=nodemailer.createTransport({
    host:process.env.SMTP_HOST,
    port:SMTP_PORT,
    secure:SMTP_PORT === 465,
    auth:{
        user:process.env.EMAIL_USER,
        pass:process.env.EMAIL_PASS
    }
});
const OTP_GENERATOR=async(req,res)=>{
    try{
        await transporter.verify();
        console.log("SMTP connection successful");
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
    await client.set(`otp : ${email}`,String(otp),{EX:60*2});
    return res.status(200).json({ message: "OTP sent successfully" });
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
        const storedOTP=await client.get(`otp : ${email}`);
        if(!storedOTP)
        {
            logger.error("OTP is expired");
            return res.status(400).json({ message: "OTP is expired" });
        }
        if(normalizeOtp(storedOTP)!==String(otp))
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