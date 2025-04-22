const ipfsClient = require('ipfs-http-client');
const fs = require('fs/promises');
const { notifyValidators } = require('../websocket.js'); // Import WebSocket function
const ipfs = ipfsClient( 'http://127.0.0.1:5001' );

//upload evidence
const uploadAfforestationEvidence=async(req,res)=>{

}

const uploadEnergySavingsEvidence=async(req,res)=>{
    const beforeFile = req.files["before"]?.[0];
    const afterFile = req.files["after"]?.[0];

    if (!beforeFile || !afterFile) {
        return res.status(400).json({ error: "Both 'before' and 'after' files are required." });
    }

    try {
        // Read both files
        const beforeBuffer = await fs.readFile(beforeFile.path);
        const afterBuffer = await fs.readFile(afterFile.path);

        // Upload to IPFS
        const beforeResult = await ipfs.add(beforeBuffer);
        const afterResult = await ipfs.add(afterBuffer);

        const beforeCID = beforeResult.path;
        const afterCID = afterResult.path;

        // Notify validators
        notifyValidators(beforeCID,afterCID, "energy");

        // Respond to frontend
        res.json({
            beforeCID,
            afterCID,
            message: "Both files uploaded to IPFS successfully!"
        });

    } catch (error) {
        console.error("Error uploading energy evidence:", error);
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

//verify evidence
const verifyAfforestationEvidence=async(req,res)=>{

};

const verifyEnergySavingsEvidence=async(req,res)=>{

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

exports.uploadAfforestationEvidence=uploadAfforestationEvidence;
exports.uploadEnergySavingsEvidence=uploadEnergySavingsEvidence;
exports.uploadSoilEvidence=uploadSoilEvidence;
exports.verifyAfforestationEvidence=verifyAfforestationEvidence;
exports.verifyEnergySavingsEvidence=verifyEnergySavingsEvidence;
exports.verifySoilEvidence=verifySoilEvidence;