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
const deleteGroup = async (req, res) => {
  try {
    const group = await Group.findByPk(req.params.groupId);

    if (!group) {
      return res.status(404).send("Group not found");
    }

    if (group.UserId === req.user.id) {
      await Chat.destroy({ where: { chatgroupId: req.params.groupId } });
      await GroupUser.destroy({ where: { GroupId: req.params.groupId } });
      await Group.destroy({ where: { id: req.params.groupId } });

      res.status(201).send("Group Deleted");
    } else {
      res.status(401).send("Not the admin.");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

const removeMember = async (req, res) => {
  try {
    if (!req.query.memberId) {
      return res.status(400).send("Invalid request. Member ID is undefined.");
    }

    await GroupUser.destroy({
      where: { UserId: req.query.memberId, GroupId: req.query.groupId },
    });

    res.status(200).json({ Success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ Success: false, error: "Internal Server Error" });
  }
};

module.exports = {
  removeMember,
  deleteGroup,
};
