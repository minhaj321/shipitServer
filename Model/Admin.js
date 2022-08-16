const mongoose =require('mongoose');

const Admin= new mongoose.Schema({
    
 username:{
     type:String,
     required:true
 },
 email:{
     type:String,
     required:true
 },
 password:{
     type:String,
     required:true
 }
}
,
{
    timestamps:true
});
module.exports= mongoose.model("Admin",Admin);