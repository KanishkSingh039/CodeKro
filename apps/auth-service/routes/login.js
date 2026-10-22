const express=require("express");
const router=express.Router();
const {login}=require("../controller/login");
const {RedirectToGoogleAuth,GoogleAuthCallback}=require("../controller/google_OAuth");
router.post("/login",login);
router.get("/google",RedirectToGoogleAuth);
router.get("/google/callback",GoogleAuthCallback);
module.exports=router;