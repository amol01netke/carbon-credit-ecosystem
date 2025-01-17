const mongoose=require('mongoose');

const validatorSchema=new mongoose.Schema({
    email:{type:String,required:true,unique:true},
    walletAddress:{type:String,required:true,unique:true},
    username:{type:String,required:true,unique:true},
    password:{type:String,required:true}
});
const Validator = mongoose.model('Validator', validatorSchema);

module.exports = Validator;
