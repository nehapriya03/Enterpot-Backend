const AWS = require("aws-sdk");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
AWS.config.update({ region: "us-east-2" });
var accessKeyId = process.env.AWS_ACCESS_KEY || "xxxxxx";
var secretAccessKey = process.env.AWS_SECRET_KEY || "+xxxxxx+B+xxxxxxx";

var s3 = new AWS.S3({
  accessKeyId,
  secretAccessKey,
});
const storage = multer.memoryStorage({
  destination: function (req, file, callback) {
    callback(null, "");
  },
});

exports.upload = multer({ storage }).single("image");

AWS.config.update({
  accessKeyId: accessKeyId,
  secretAccessKey: secretAccessKey,
});

exports.fileUploadToS3 = async (req, res) => {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `/${Date.now()}_${req.file.originalname}`,
    Body: req.file.buffer,
  };
  await s3.upload(params, (error, data) => {
    if (error) {
      console.error();
      throw new Error(`There was some issue in uploading the image to s3.`);
    }
    console.info();
    return res.status(200).send(data);
  });
};
