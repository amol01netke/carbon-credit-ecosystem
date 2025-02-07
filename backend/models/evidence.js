const mongoose=require('mongoose');

const evidenceSchema=new mongoose.Schema({
    walletAddress:{type:String},
    cid:{type:String}
});

const Evidence = mongoose.model('Evidence', evidenceSchema, 'evidences');

module.exports=Evidence;