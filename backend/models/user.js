const mongoose=require('mongoose');

const userSchema=new mongoose.Schema({
    email:{type:String,required:true,unique:true},
    walletAddress:{type:String,required:true,unique:true},
    username:{type:String,required:true},
    password:{type:String,required:true}
});
const User = mongoose.model('User', userSchema);

module.exports = User;
