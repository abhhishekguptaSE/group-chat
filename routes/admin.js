const express = require("express");

const adminController = require("../controllers/admin");
const authorization = require("../services/auth");
const router = express.Router();
// Multer configuration
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get(
  `/removeMember/`,
  authorization.authenticate,
  adminController.removeMember
);

router.get(
  `/deleteGroup/:groupId`,
  authorization.authenticate,
  adminController.deleteGroup
);

module.exports = router;
