const express = require("express");
const chatController = require("../controllers/chat");
const authorization = require("../services/auth");
const router = express.Router();
// Multer configuration
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/postChat", authorization.authenticate, chatController.postChat);
router.get("/getChat/", authorization.authenticate, chatController.getChat);
router.get(
  "/getUser/:UserId",
  authorization.authenticate,
  chatController.getUser
);

module.exports = router;
