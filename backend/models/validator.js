const mongoose=require('mongoose');

const validatorSchema=new mongoose.Schema({
    role: { 
        type: String, 
        enum: ['gps-validator', 'report-validator'], 
        required: true 
    },
    firstName:{type:String,required:true},
    lastName:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    username:{type:String,required:true,unique:true},
    password:{type:String,required:true}
});

const Validator = mongoose.model('Validator', validatorSchema, 'validators');

module.exports = Validator;
