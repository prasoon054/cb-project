const express = require("express");
const {
  addComment,
  getCommentsByBlogId,
} = require("../controllers/commentController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/", protect, addComment);
router.get("/", getCommentsByBlogId);

module.exports = router;
