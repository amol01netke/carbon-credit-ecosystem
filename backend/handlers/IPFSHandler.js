const ipfsClient = require('ipfs-http-client');
const fs = require('fs/promises');
const { notifyValidators } = require('../websocket.js'); // Import WebSocket function
const ipfs = ipfsClient( 'http://127.0.0.1:5001' );

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

const verifySoilEvidence=async(req,res)=>{
    let sequestrationAmount=0;
    const { reportCID } = req.body;

    if (!reportCID) {
        return res.status(400).json({ error: "Missing reportCID" });
    }
    
    try {
        // verify & calculate sequestration
        sequestrationAmount=5;

        //response
        res.json({
            status:"verified",
            sequestrationAmount,
        });
    }catch(error){
        console.log("ERROR : ",error);
    }
};

const verifyAfforestationEvidence=async(req,res)=>{

};

exports.uploadSoilEvidence=uploadSoilEvidence;
exports.uploadAfforestationEvidence=uploadAfforestationEvidence;
exports.verifySoilEvidence=verifySoilEvidence;
exports.verifyAfforestationEvidence=verifyAfforestationEvidence;