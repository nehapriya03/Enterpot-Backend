const AWS = require("aws-sdk");
const multer = require("multer");
AWS.config.update({ region: "us-east-2" });
var accessKeyId = process.env.AWS_ACCESS_KEY || "xxxxxx";
var secretAccessKey = process.env.AWS_SECRET_KEY || "+xxxxxx+B+xxxxxxx";

exports.s3 = new AWS.S3({
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

// var params = {  Bucket: 'your bucket', Key: 'your object' };

// exports.s3.deleteObject(params, function(err, data) {
//   if (err) console.log(err, err.stack);  // error
//   else     console.log();                 // deleted
// });
