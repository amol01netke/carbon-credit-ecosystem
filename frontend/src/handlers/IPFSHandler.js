import { create } from "ipfs-http-client";

const ipfs = create({ url: 'http://127.0.0.1:5001' });

export const uploadToIPFS = async (file) => {
  try {
    const added = await ipfs.add(file);
    console.log("File uploaded to IPFS:", added);
    return added.path; // Returns the CID (Content Identifier) of the file
  } catch (error) {
    console.error("Error uploading to IPFS:", error);
    throw error;
  }
};

export const getFromIPFS = async (cid) => {
  try {
    const url = `https://ipfs.io/ipfs/${cid}`;
    console.log("IPFS file URL:", url);
    return url; // File URL to access in the browser
  } catch (error) {
    console.error("Error retrieving from IPFS:", error);
    throw error;
  }
};
