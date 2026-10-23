const {mongoose}=require('@codekro/db_config');

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true
    },
    username:{
        type:String,
        required:true,
        trim:true
    },
    picture:{
        type:String,
        required:true,
        trim:true
    },
    password:{
        type:String,
        trim:true
    }
})

module.exports=new mongoose.model('CodeKroUser',userSchema);