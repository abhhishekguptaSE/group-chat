const express = require("express");

const mainController = require("../controllers/group");
const authorization = require("../services/auth");
const router = express.Router();
// Multer configuration
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get(
  "/groupParams/:groupName",
  authorization.authenticate,
  mainController.groupName
);

router.get(
  "/group/getGroup",
  authorization.authenticate,
  mainController.getGroup
);

router.get(
  "/groupInfo/:groupId",
  authorization.authenticate,
  mainController.groupInfo
);

router.get(`/copyLink`, authorization.authenticate, mainController.inviteLink);

module.exports = router;
