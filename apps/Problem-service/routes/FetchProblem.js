const express=require("express");
const router=express.Router();
const fetch_problem=require("../controller/fetch_problems");
router.post("/fetchProblem",fetch_problem);
module.exports=router;