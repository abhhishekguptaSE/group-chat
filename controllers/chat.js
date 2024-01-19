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
var io = require("socket.io")(5000, {
  cors: {
    origin: "*",
  },
});
io.on("connection", (socket) => {
  socket.on("batman", (message) => {
    socket.broadcast.emit("renderChat", "renderchat");
  });
});
const postChat = async (req, res, next) => {
  try {
    const response = await Chat.create({
      chat: req.body.chat,
      UserId: req.user.id,
      chatgroupId: parseInt(req.body.chatgroupid),
    });
    res.status(201).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

const getChat = async (req, res, next) => {
  try {
    if (req.query.MessageId === "undefined") {
      const result = await raw.execute(`
          SELECT *
          FROM Chats c
          WHERE chatgroupId=${req.query.GroupId}
        `);
      res.json(result[0]);
    } else {
      const result = await Chat.findAll({
        where: { chatgroupId: req.query.GroupId },
      });

      if (result) {
        lastLSId = req.query.MessageId;
        lastId = result.slice(-1)[0].id;

        if (lastLSId < lastId) {
          res.json(result.slice(lastLSId, lastId));
        }
      }
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const getUser = async (req, res) => {
  try {
    const result = await User.findByPk(req.params.UserId);

    if (!result) {
      return res.status(404).send("User not found");
    }

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};
module.exports = {
  postChat,
  getChat,
  getUser,
};
