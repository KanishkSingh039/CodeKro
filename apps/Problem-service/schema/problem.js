const {mongoose}=require('@codekro/db_config');

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
        type:String,
        required:true
    },
    difficulty:{
        type:String,
        required:true
    },
    
})
module.exports=mongoose.model("problem",problemSchema);
    