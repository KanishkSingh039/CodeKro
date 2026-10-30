const {mongoose}=require('mongoose');

const MAX_TEXT_LENGTH=100000;
const MAX_JUDGEMENT_BYTES=200*1024;

const SolutionSchema=new mongoose.Schema({
    user_id:{
        type:String,
        required:true
    },
    output:{
        type:String,
        required:true,
        maxlength:MAX_TEXT_LENGTH
    },
    input:{
        type:String,
        required:true,
        maxlength:MAX_TEXT_LENGTH
    },
    error:{
        type:String,
        maxlength:MAX_TEXT_LENGTH
    },
    code:{
        type:String,
        required:true,
        maxlength:MAX_TEXT_LENGTH
    },
    language:{
        type:String,
        required:true,
        trim:true,
        enum:["cpp","py","java"]
    },
    problem_id:{
        type:String,
        required:true
    },
    job_id:{
        type:String,
        trim:true,
        unique:true,
        sparse:true
    },
    judgement:{
        type:Object,
        required:true,
        validate:{
            validator:value=>Buffer.byteLength(JSON.stringify(value))<=MAX_JUDGEMENT_BYTES,
            message:`judgement must be at most ${MAX_JUDGEMENT_BYTES} bytes`
        }
    }
},{
    timestamps:true
});
SolutionSchema.index({user_id:1,problem_id:1,createdAt:-1});
module.exports=mongoose.model("solution",SolutionSchema)