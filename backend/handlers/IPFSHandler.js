const ipfsClient = require('ipfs-http-client');
const fs = require('fs/promises');
const { notifyValidators } = require('../websocket.js'); // Import WebSocket function
const ipfs = ipfsClient( { url: 'http://127.0.0.1:5001' } );

const uploadEvidence = async (req, res) => {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    try {
        //report stored on ipfs
        const fileBuffer = await fs.readFile(file.path);
        const fileAdded = await ipfs.add(fileBuffer);
        const fileCID = fileAdded.path;

        //notify validators through socket
        notifyValidators(fileCID);

        //response to user evidence 
        res.json({ 
            fileCID,
            message: "Data uploaded to IPFS successfully!" 
        });
    } catch (error) {
        res.status(500).json({ error: "Error uploading to IPFS" });
    } 
};

exports.uploadEvidence=uploadEvidence;