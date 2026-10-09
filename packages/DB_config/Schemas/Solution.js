const {mongoose}=require('mongoose');

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
        type:Object,
        required:true
    }
});
module.exports=mongoose.model("solution",SolutionSchema)