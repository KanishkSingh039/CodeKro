const express=require("express");
const router=express.Router();
const AI_serviceController=require("../controller/AI_service");
const { authenticate } = require("@codekro/authentication-middleware");
router.post("/AI_service",authenticate,AI_serviceController);
module.exports=router;