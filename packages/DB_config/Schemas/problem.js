const mongoose=require('mongoose');
const testCaseSchema = new mongoose.Schema(
    {
        input: {
            type: mongoose.Schema.Types.Mixed,
            required: true,
        },
        output: {
            type: mongoose.Schema.Types.Mixed,
            required: true,
        },
    },
    { _id: false }
);
const problemSchema=new mongoose.Schema({
    user_id:{
        type:String,
        required:true
    },  
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    test_case:{
        type:[testCaseSchema],
        required:true
    },
    difficulty:{
        type:String,
        required:true
    },
    
})
module.exports=mongoose.model("problem",problemSchema);
    