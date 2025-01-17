const mongoose=require('mongoose');

const generatorSchema=new mongoose.Schema({
    email:{type:String,required:true,unique:true},
    walletAddress:{type:String,required:true,unique:true},
    username:{type:String,required:true,unique:true},
    password:{type:String,required:true}
});
const Generator = mongoose.model('User', generatorSchema);

module.exports = Generator;
