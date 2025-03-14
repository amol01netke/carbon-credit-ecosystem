const ipfsClient = require('ipfs-http-client');
const fs = require('fs/promises');
const { notifyValidators } = require('../websocket.js'); // Import WebSocket function
const ipfs = ipfsClient( 'http://127.0.0.1:5001' );
const Web3=require('web3');
const contractABI=require("./abis/MultiValidatorABI.json");

const uploadAfforestationEvidence=async(req,res)=>{
    try {
        //notify validators through socket
        notifyValidators("afforestation");

        //response to user evidence 
        res.json({ 
            message: "Data uploaded to IPFS successfully!" 
        });
    } catch (error) {
        res.status(500).json({ error: "Error uploading to IPFS" });
    } 
}

const uploadSoilEvidence = async (req, res) => {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    try {
        //soil report stored on ipfs
        const fileBuffer = await fs.readFile(file.path);
        const fileAdded = await ipfs.add(fileBuffer);
        const fileCID = fileAdded.path;

        //notify validators through socket
        notifyValidators(fileCID,"soil");

        //response to user evidence 
        res.json({ 
            fileCID,
            message: "Data uploaded to IPFS successfully!" 
        });
    } catch (error) {
        res.status(500).json({ error: "Error uploading to IPFS" });
    } 
};

const processSoilEvidence=async(req,res)=>{
    const { reportCID } = req.body;

    if (!reportCID) {
        return res.status(400).json({ error: "Missing reportCID" });
    }
    
    let sequestrationAmount=0;
    let approvalCount=0;
    let transactionHash=null;

    try {
        //calculate sequestration
        sequestrationAmount=5;

        //increase count
        approvalCount++;

        //call method
        if(approvalCount==2){
            const contract = new Web3.eth.Contract(contractABI.abi, contractAddress);

            transactionHash = await contract.methods
                .voteToApprove(reportCID, sequestrationAmount)
                .send({
                    from: validatorAddress,
                    gas: 300000,
                });

            approvalCount = 0;
        }


        //response
        res.json({
            status:"verified",
            sequestrationAmount,
            approvalCount,
            transactionHash
        });
    }catch(error){
        console.log("ERROR : ",error);
    }
};

const processAfforestationEvidence=async(req,res)=>{

};

exports.uploadSoilEvidence=uploadSoilEvidence;
exports.uploadAfforestationEvidence=uploadAfforestationEvidence;
exports.processSoilEvidence=processSoilEvidence;
exports.processAfforestationEvidence=processAfforestationEvidence;