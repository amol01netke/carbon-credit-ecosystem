const ipfsClient = require('ipfs-http-client');
const fs = require('fs/promises');
const Evidence = require('../models/evidence.js');

const ipfs = ipfsClient( 'http://127.0.0.1:5001' );


const uploadToIPFS = async (req, res) => {
  const file = req.file;
  const address=req.body.userWalletAddress;

  if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
  }

  // Validate file type (e.g., image files)
  

  try {
      const fileBuffer = await fs.readFile(file.path);
      const added = await ipfs.add(fileBuffer);
      console.log("File uploaded to IPFS:", added);

      const newEvidence=new Evidence({
        cid:added.path,
        walletAddress:address
      });
      await newEvidence.save();

      res.json({ 
        cid: added.path,
        walletAddress:address
        });

  } catch (error) {
      console.error("Error uploading to IPFS:", error);
      res.status(500).json({ error: "Error uploading to IPFS" });
  }
};

const getFromIPFS = async (req, res) => {
    const { cid } = req.params ;  // ✅ FIX: Use query params, not req.params

    if (!cid) {
        return res.status(400).json({ error: "CID is required" });
    }
    
    try {
        const fileChunks = [];
        for await (const chunk of ipfs.cat(cid)) {
            fileChunks.push(chunk);
        }

        if (fileChunks.length === 0) {
            return res.status(404).json({ error: "File not found on IPFS" });
        }

        const fileBuffer = Buffer.concat(fileChunks);
        let jsonData;

        try {
            jsonData = JSON.parse(fileBuffer.toString());  // ✅ FIX: JSON Parsing Error Handling
        } catch (parseError) {
            return res.status(500).json({ error: "Invalid JSON format in IPFS file" });
        }

        const evidence = await Evidence.findOne({ cid });

        const walletAddress = evidence.walletAddress;

        res.setHeader("Content-Type", "application/json");
        res.json({fileContent: jsonData, walletAddress});

    } catch (error) {
        console.error("Error fetching from IPFS:", error);
        res.status(500).json({ error: "Error fetching file from IPFS" });
    }
}

exports.uploadToIPFS=uploadToIPFS;
exports.getFromIPFS=getFromIPFS;
