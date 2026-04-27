const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const fs = require("fs");
const path = require("path");

const s3 = new S3Client({
  endpoint: "https://s3.filebase.com",
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.FILEBASE_KEY,
    secretAccessKey: process.env.FILEBASE_SECRET,
  },
});

const uploadPDFtoPinata = async (filePath) => {
  const fileBuffer = fs.readFileSync(filePath);
  const fileName = path.basename(filePath);

  const command = new PutObjectCommand({
    Bucket: process.env.FILEBASE_BUCKET,
    Key: fileName,
    Body: fileBuffer,
    ContentType: "application/pdf",
  });

  const response = await s3.send(command);

  const cid = response.$metadata?.headers?.["x-amz-meta-cid"];
  if (!cid) throw new Error("Filebase did not return an IPFS CID");

  return cid;
};

module.exports = { uploadPDFtoPinata };