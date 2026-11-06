require("dotenv").config();
const jwt=require("jsonwebtoken");

const AUTH_COOKIE_NAME="codekro_token";
const PROFILE_COOKIE_NAME="codekro_profile";

const validateAuthConfig=()=>{
    if(!process.env.JWT_SECRET){
        throw new Error("JWT_SECRET is not defined");
    }
}

const getCookieBaseOptions=()=>({
    secure:process.env.NODE_ENV==="production",
    sameSite:"lax",
    path:"/",
    maxAge:60*60*1000
});

const getAuthCookieOptions=()=>({
    ...getCookieBaseOptions(),
    httpOnly:true
});

const getProfileCookieOptions=()=>({
    ...getCookieBaseOptions(),
    httpOnly:false
});

const getProfileFromToken=(token)=>{
    const payload=jwt.decode(token);
    if(!payload) return null;

    return {
        id:payload.id ? String(payload.id) : "",
        name:payload.name || payload.username || "",
        username:payload.username || "",
        email:payload.email || "",
        picture:payload.picture || ""
    };
};

const setAuthCookie=(res,token)=>{
    res.cookie(AUTH_COOKIE_NAME,token,getAuthCookieOptions());

    const profile=getProfileFromToken(token);
    if(profile){
        res.cookie(PROFILE_COOKIE_NAME,JSON.stringify(profile),getProfileCookieOptions());
    }
};

const getClearCookieOptions=(httpOnly)=>{
    const options=getCookieBaseOptions();
    delete options.maxAge;
    return {...options,httpOnly};
};

const clearAuthCookie=(res)=>{
    res.clearCookie(AUTH_COOKIE_NAME,getClearCookieOptions(true));
    res.clearCookie(PROFILE_COOKIE_NAME,getClearCookieOptions(false));
};

const parseCookies=(cookieHeader="")=>{
    return cookieHeader.split(";").reduce((cookies,part)=>{
        const separatorIndex=part.indexOf("=");
        if(separatorIndex===-1) return cookies;

        const key=part.slice(0,separatorIndex).trim();
        const value=part.slice(separatorIndex+1).trim();
        if(!key) return cookies;

        try {
            cookies[key]=decodeURIComponent(value);
        } catch (error) {
            cookies[key]=value;
        }
        return cookies;
    },{});
};

const authenticate=(req,res,next)=>{
    const authHeader=req.headers.authorization;
    const bearerToken=authHeader && authHeader.startsWith("Bearer ")
        ? authHeader.slice(7).trim()
        : "";
    const cookieToken=parseCookies(req.headers.cookie)[AUTH_COOKIE_NAME];
    const JWTtoken=bearerToken || cookieToken;

    if(!JWTtoken){
        return res.status(401).json({
            message:"No token provided"
        })
    }
    try {
        req.user=jwt.verify(JWTtoken,process.env.JWT_SECRET);
        return next();
    } catch (error) {
        return res.status(401).json({
            message:"Invalid or expired token"
        })
    }
}
module.exports={
    authenticate,
    validateAuthConfig,
    AUTH_COOKIE_NAME,
    PROFILE_COOKIE_NAME,
    getAuthCookieOptions,
    setAuthCookie,
    clearAuthCookie
};
