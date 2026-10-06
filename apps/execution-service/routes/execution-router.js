const express=require("express");
const router=express.Router();
const {execution}=require("../controller/execution-controller");
router.post("/service",execution);
module.exports=router;