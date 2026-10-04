const express=require("express");
const router=express.Router();
const AI_serviceController=require("../controller/AI_service");

router.post("/AI_service",AI_serviceController);
module.exports=router;