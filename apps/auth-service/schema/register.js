const {mongoose}=require('@codekro/db_config');

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true,
        maxlength:100
    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true
    },
    username:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true,
        maxlength:30,
        match:[/^[a-z0-9_]+$/,"Username may contain only lowercase letters, numbers, and underscores"]
    },
    picture:{
        type:String,
        trim:true
    },
    password:{
        type:String,
        trim:true
    }
},{
    timestamps:true
})

module.exports=new mongoose.model('CodeKroUser',userSchema);