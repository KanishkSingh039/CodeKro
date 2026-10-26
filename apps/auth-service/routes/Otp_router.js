const express=require('express');
const {OTP_GENERATOR,OTP_VERIFY}=require('../controller/Otp_controller');
const router=express.Router();
router.post('/generateotp',OTP_GENERATOR);
router.post('/verifyotp',OTP_VERIFY);
module.exports=router