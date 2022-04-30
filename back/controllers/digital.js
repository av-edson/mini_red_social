const AWS = require("aws-sdk");
const webConfig = require("../config/webConfig");

const spacesEndpoint = new AWS.Endpoint(webConfig.s3_endpoint);
const client_s3 = new AWS.S3({
  endpoint: spacesEndpoint,
  accessKeyId: webConfig.accessKeyId,
  secretAccessKey: webConfig.secretAccessKey,
});

module.exports.upload = async function (b64_file, username) {
  return new Promise((resolve, reject) => {
    let b64_decode = new Buffer.from(b64_file, "base64");
    username = "profiles/profile-" + username + ".jpg";
    var params = {
      Body: b64_decode,
      Bucket: webConfig.space_name,
      Key: username,
      ACL: "public-read",
      ContentType: "image/jpeg",
    };
    client_s3.upload(params, (err, data) => {
      if (err) {
        console.log(err);
        return resolve(false);
      }
      console.log("Your file has been uploaded successfully!", data);
      return resolve(true);
    });
  });
};

module.exports.delete = async function (username) {
  return new Promise((resolve, reject) => {
    username = "profile-" + username + ".jpg";
    var params = {
      Key: username,
      Bucket: webConfig.space_name,
    };
    client_s3.headObject(params, (err, data) => {
      if (err) {
        console.log(err);
        return resolve(false);
      } else {
        client_s3.deleteObject(params, (err, data) => {
          if (err) {
            console.log(err);
            return resolve(false);
          }
          console.log("Your file has been deleted successfully!", data);
          return resolve(true);
        });
      }
    });
  });
};

module.exports.uploadPublication = async function (b64_file, username) {
  return new Promise((resolve, reject) => {
    let b64_decode = new Buffer.from(b64_file, "base64");
    var params = {
      Body: b64_decode,
      Bucket: webConfig.space_name,
      Key: username,
      ACL: "public-read",
      ContentType: "image/jpeg",
    };
    client_s3.upload(params, (err, data) => {
      if (err) {
        console.log(err);
        return resolve(false);
      }
      console.log("Your file has been uploaded successfully!", data);
      return resolve(true);
    });
  });
};
