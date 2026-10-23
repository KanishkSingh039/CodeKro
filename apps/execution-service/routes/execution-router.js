const express=require("express");
const router=express.Router();
const {execution}=require("../controller/execution-controller");
const { authenticate } = require("@codekro/authentication-middleware");
router.post("/service",authenticate,execution);
module.exports=router;