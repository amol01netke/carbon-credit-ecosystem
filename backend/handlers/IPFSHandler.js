const ipfsClient = require('ipfs-http-client');
const fs = require('fs/promises');
const { notifyValidators } = require('../websocket.js'); // Import WebSocket function
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
    
    notifyValidators(fileCID);

    res.json({ fileCID, message: "File uploaded to IPFS and data stored in MongoDB successfully!" });
  } catch (error) {
      console.error("Error uploading to IPFS:", error);
      res.status(500).json({ error: "Error uploading to IPFS" });
  } 
};

const fetchAndVerifyFromIPFS= async (req, res) => {
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

        const fileBuffer = Buffer.concat(fileChunks);  

        let extractedText = "";
        const pdfData = await pdf(fileBuffer);  // ✅ Extract text from PDF
        extractedText = pdfData.text;
        
        let tokensAllocated=0;
        const carbonMatch = extractedText.match(/Carbon Sequestration Potential:\s*([\d.]+)\s*Tons CO2\/ha/i);
        if (carbonMatch) {
            const carbonSequestration = parseFloat(carbonMatch[1]);
            if (carbonSequestration >= 5) {
                tokensAllocated += 100;
            } else if (carbonSequestration >= 3) {
                tokensAllocated += 50;
            } else {
                tokensAllocated += 20;
            }
        }

        return res.status(200).json({
            status: "OK",
            tokens: tokensAllocated
        });
        
    } catch (error) {
        console.error("Error fetching from IPFS:", error);
        res.status(500).json({ error: "Error fetching file from IPFS" });
    }
}

exports.uploadToIPFS=uploadToIPFS;
exports.fetchAndVerifyFromIPFS=fetchAndVerifyFromIPFS;
