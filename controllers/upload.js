const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Sequelize = require("sequelize");
const { Op } = require("sequelize");
const raw = require("../util/rawdatabse");
const sequelize = require("../util/database");
const User = require("../models/user");
const Chat = require("../models/chat");
const Group = require("../models/group");
const GroupUser = require("../models/groupUser");
const Upload = require("../models/upload");
const multer = require("multer");
const multerS3 = require("multer-s3");
const AWS = require("aws-sdk");

AWS.config.update({
  accessKeyId: process.env.IAM_USER_KEY,
  secretAccessKey: process.env.IAM_USER_SECRET,
  region: "ap-south-1",
});
const s3 = new AWS.S3();
const uploadImage = async (req, res) => {
  console.log(req.file);
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Upload file to S3
    const params = {
      Bucket: "meabhibucket",
      Key: `${Date.now()}-${req.file.originalname}`,
      Body: req.file.buffer,
      ACL: "public-read",
    };

    const uploadResult = await s3.upload(params).promise();

    // Return the S3 URL
    const s3Url = uploadResult.Location;
    console.log("meaow", s3Url);
    await Upload.create({
      link: s3Url,
      UserId: req.user.id,
    });
    res.json({ imageUrl: s3Url });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const fetchBase = async (req, res) => {
  const s3 = new AWS.S3({
    region: "ap-south-1",
    accessKeyId: process.env.IAM_USER_KEY,
    secretAccessKey: process.env.IAM_USER_SECRET,
  });

  const params = {
    Bucket: "meabhibucket",
  };

  s3.getObject(params, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      res.send(Buffer.from(data.Body, "base64").toString());
    }
  });
};
module.exports = {
  fetchBase,
  uploadImage,
};
