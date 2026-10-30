const express=require("express");
const router=express.Router();
const {execution,executionStatus}=require("../controller/execution-controller");
const { authenticate } = require("@codekro/authentication-middleware");
router.post("/service",authenticate,execution);
router.get("/service/:jobId",authenticate,executionStatus);
module.exports=router;
