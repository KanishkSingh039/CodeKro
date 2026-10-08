const mongoose=require('../db_config');

const SolutionSchema=new mongoose.Schema({
    user_id:{
        type:String,
        required:true
    },
    output:{
        type:String,
        required:true
    },
    input:{
        type:String,
        required:true
    },
    error:{
        type:String,
        required:true
    },
    code:{
        type:String,
        required:true
    },
    language:{
        type:String,
        required:true
    },
    problem_id:{
        type:String,
        required:true
    },
    judgement:{
        type:String,
        required:true
    }
});
module.exports=mongoose.model("solution",SolutionSchema)