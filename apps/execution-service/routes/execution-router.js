const express=require("express");
const router=express.Router();
const {execution,executionStatus,latestSolution}=require("../controller/execution-controller");
const { authenticate } = require("@codekro/authentication-middleware");
router.post("/service",authenticate,execution);
router.get("/service/:jobId",authenticate,executionStatus);
router.get("/solution/:problemId",authenticate,latestSolution);
module.exports=router;
