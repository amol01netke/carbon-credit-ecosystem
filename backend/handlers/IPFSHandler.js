const { create } = require('ipfs-http-client');
const fs = require('fs/promises');

const ipfs = create({ url: 'http://127.0.0.1:5001' });


const uploadToIPFS = async (req, res) => {
  const file = req.file;
  if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
  }

  // Validate file type (e.g., image files)
  const validMimeTypes = ["image/jpeg", "image/png", "image/gif"];
  if (!validMimeTypes.includes(file.mimetype)) {
      return res.status(400).json({ error: "Invalid file type" });
  }

  try {
      const fileBuffer = await fs.readFile(file.path);
      const added = await ipfs.add(fileBuffer);
      console.log("File uploaded to IPFS:", added);

      // Delete the file
      await fs.unlink(file.path);

      res.json({ cid: added.path });
  } catch (error) {
      console.error("Error uploading to IPFS:", error);
      res.status(500).json({ error: "Error uploading to IPFS" });
  }
};

exports.uploadToIPFS=uploadToIPFS;