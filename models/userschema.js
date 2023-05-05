const mongoose=require('mongoose');
const plm=require('passport-local-mongoose')
const userschema= mongoose.Schema({
username:{
    type:String,
},
password:{
    type:String,
},
email:{
    type:String,
}
})

userschema.plugin(plm);
module.exports=mongoose.model('user',userschema )