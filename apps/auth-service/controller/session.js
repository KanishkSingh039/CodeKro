const logger=require('@codekro/logger');
const {clearAuthCookie}=require('@codekro/authentication-middleware');
const CodeKroUser=require('../schema/register');

const getMe=async(req,res)=>{
    try {
        if(!req.user?.id){
            return res.status(401).json({ message: "Invalid session" });
        }

        const user=await CodeKroUser.findById(req.user.id)
            .select("name username email picture")
            .lean();

        if(!user){
            return res.status(404).json({ message: "User not found" });
        }

        res.set("Cache-Control","no-store");
        return res.status(200).json({
            user:{
                id:String(user._id),
                name:user.name,
                username:user.username,
                email:user.email,
                picture:user.picture || ""
            }
        });
    } catch (error) {
        logger.error(`Failed to fetch current user: ${error.message}`);
        return res.status(500).json({ message: "Failed to fetch current user" });
    }
};

const logout=(req,res)=>{
    clearAuthCookie(res);
    return res.status(200).json({ message: "Logged out" });
};

module.exports={getMe,logout};
