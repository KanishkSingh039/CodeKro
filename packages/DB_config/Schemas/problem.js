const mongoose=require('mongoose');
const MAX_TEST_CASE_COUNT=20;
const MAX_TEST_CASE_BYTES=100*1024;
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
        required:true,
        trim:true,
        maxlength:200
    },
    description:{
        type:String,
        required:true,
        trim:true,
        maxlength:20000
    },
    test_case:{
        type:[testCaseSchema],
        required:true,
        validate:[
            {
                validator:value=>Array.isArray(value) && value.length>=1 && value.length<=MAX_TEST_CASE_COUNT,
                message:`test_case must contain between 1 and ${MAX_TEST_CASE_COUNT} cases`
            },
            {
                validator:value=>Array.isArray(value) && value.every(item=>{
                    const serialized=JSON.stringify({input:item.input,output:item.output});
                    return Buffer.byteLength(serialized)<=MAX_TEST_CASE_BYTES;
                }),
                message:`each test case must be at most ${MAX_TEST_CASE_BYTES} bytes`
            }
        ]
    },
    difficulty:{
        type:String,
        required:true,
        trim:true,
        lowercase:true,
        enum:["easy","medium","hard"]
    },
    
},{
    timestamps:true
})
problemSchema.index({user_id:1,createdAt:-1});
module.exports=mongoose.model("problem",problemSchema);
    