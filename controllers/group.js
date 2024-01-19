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

const groupName = async (req, res, next) => {
  try {
    const group = await Group.create({
      name: req.params.groupName,
      UserId: req.user.id,
    });
    await GroupUser.create({
      UserId: req.user.id,
      GroupId: group.id,
    });
    res.json(group);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getGroup = async (req, res) => {
  try {
    if (!req.user.id) {
      return res.status(400).send("Invalid request. User ID is undefined.");
    }

    const result = await raw.execute(`
      SELECT *
      FROM chatgroups cg
      JOIN GroupUsers gu ON cg.id = gu.GroupId
      WHERE gu.UserId = ${req.user.id}
    `);

    res.json(result[0]);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

const groupInfo = async (req, res) => {
  try {
    const result = await raw.execute(`
      SELECT cg.id AS groupid, cg.UserId AS admin, gu.UserId AS member
      FROM chatgroups cg
      JOIN GroupUsers gu ON cg.id = gu.GroupId
      WHERE cg.id = ${req.params.groupId}
    `);

    if (req.user.id == result[0][0].admin) {
      result[0].push(true);
    } else {
      result[0].push(false);
    }

    res.status(200).json(result[0]);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

const inviteLink = async (req, res) => {
  try {
    const result = await raw.execute(
      `SELECT * FROM  GroupUsers WHERE GroupId=${req.query.grpId} AND UserId=${req.user.id}`
    );

    if (!result[0][0]) {
      await GroupUser.create({
        UserId: req.user.id,
        GroupId: parseInt(req.query.grpId),
      });
      return res.status(200).json({ Success: "true" });
    } else {
      res.status(401).send("Already a member.");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = {
  groupName,
  getGroup,
  groupInfo,
  inviteLink,
};
