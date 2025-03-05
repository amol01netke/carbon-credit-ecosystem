const ipfsClient = require('ipfs-http-client');
const fs = require('fs/promises');
const { notifyValidators } = require('../websocket.js'); // Import WebSocket function
const pdf = require("pdf-parse");
const ipfs = ipfsClient( 'http://127.0.0.1:5001' );

const uploadToIPFS = async (req, res) => {
    const file = req.file;
    const { latitude, longitude } = req.body;

  if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
  }

  try {
    //soil report stored on ipfs
    const fileBuffer = await fs.readFile(file.path);
    const fileAdded = await ipfs.add(fileBuffer);
    const fileCID = fileAdded.path;

    //metadata
    const metadata = {
        fileCID: fileCID,
        latitude: latitude,
        longitude: longitude,
        timestamp: new Date().toISOString(),
    };

    const metadataBuffer = Buffer.from(JSON.stringify(metadata));
    const metadataAdded = await ipfs.add(metadataBuffer);
    const metadataCID = metadataAdded.path;
    
    //notify validators through socket
    notifyValidators(metadata);

    //response to user evidence 
    res.json({ 
        metadata,
        message: "Data uploaded to IPFS successfully!" 
    });
  } catch (error) {
      res.status(500).json({ error: "Error uploading to IPFS" });
  } 
};

exports.uploadToIPFS=uploadToIPFS;