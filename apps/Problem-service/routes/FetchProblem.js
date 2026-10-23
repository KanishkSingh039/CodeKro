const express=require("express");
const router=express.Router();
const fetch_problem=require("../controller/fetch_problems");
const { authenticate } = require("@codekro/authentication-middleware");
router.post("/fetchProblem",authenticate,fetch_problem);
module.exports=router;