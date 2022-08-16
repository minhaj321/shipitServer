const mongoose=require('mongoose');

const Vehicle =new mongoose.Schema({
 accountId:
{
    type:String,
    required:true
},
manufacturer:{
    type:String,
    required:true
},
model:{
    type:String,
    required:true
},
year:{
    type:String,
    required:true
},
color:{
    type:String,
    required:true
},
licensePlate:{
    type:String,
    required:true
},
status:{
    type: String,
    required: true
}
},{timestamps:true});

module.exports=new mongoose.model("Vehicle",Vehicle);