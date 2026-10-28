const express=require("express");
const router=express.Router();
const {AI_serviceController,problemGenerationStatus}=require("../controller/AI_service");
const { authenticate } = require("@codekro/authentication-middleware");
router.post("/AI_service",authenticate,AI_serviceController);
router.get("/AI_service/:jobId",authenticate,problemGenerationStatus);
module.exports=router;
