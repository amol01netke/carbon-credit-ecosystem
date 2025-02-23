const ipfsClient = require('ipfs-http-client');
const fs = require('fs/promises');
const Evidence = require('../models/evidence.js');
const pdf = require("pdf-parse");

const ipfs = ipfsClient( 'http://127.0.0.1:5001' );


const uploadToIPFS = async (req, res) => {
    const file = req.file;

  if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
  }

  try {
    const fileBuffer = await fs.readFile(file.path);
    const fileAdded = await ipfs.add(fileBuffer);
    const fileCID = fileAdded.path;
    
    //store on evidence schema
    const newEvidence = new Evidence({
        cid: fileCID
    });

    await newEvidence.save();

    res.json({ fileCID, message: "File uploaded to IPFS and data stored in MongoDB successfully!" });
  } catch (error) {
      console.error("Error uploading to IPFS:", error);
      res.status(500).json({ error: "Error uploading to IPFS" });
  } 
};

//QmREn8VAABpxjKWeXvFZhaMcxZwz3bzajtKkp2eUaxrBYv

const fetchAndVerify= async (req, res) => {
    const { cid } = req.params ;  // from the url

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

        const fileBuffer = Buffer.concat(fileChunks);  // ✅ Keep the file as a Buffer
        let extractedText = "";

        const pdfData = await pdf(fileBuffer);  // ✅ Extract text from PDF
        extractedText = pdfData.text;
        console.log(extractedText);
        
        return res.status(200).json({
            status: "OK",
            extractedText: extractedText
        });
    } catch (error) {
        console.error("Error fetching from IPFS:", error);
        res.status(500).json({ error: "Error fetching file from IPFS" });
    }
}

exports.uploadToIPFS=uploadToIPFS;
exports.fetchAndVerify=fetchAndVerify;