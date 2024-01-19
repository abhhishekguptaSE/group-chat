const express = require("express");
const uploadController = require("../controllers/upload");
const authorization = require("../services/auth");
const router = express.Router();
// Multer configuration
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post(
  "/file/upload",
  authorization.authenticate,
  upload.single("image"),
  uploadController.uploadImage
);

router.get(
  "/fetchbase64/:txt",
  authorization.authenticate,
  uploadController.fetchBase
);

module.exports = router;
