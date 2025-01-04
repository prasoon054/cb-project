const { pool } = require("../config/db");

const addComment = async (req, res, next) => {
  const { blog_id, content } = req.body;

  if (!blog_id || !content) {
    return res.status(400).json({ message: "Blog ID and content are required" });
  }

  try {
    const result = await pool.query(
      "INSERT INTO comments (blog_id, user_id, content) VALUES ($1, $2, $3) RETURNING *",
      [blog_id, req.user.id, content]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

const getCommentsByBlogId = async (req, res, next) => {
  const { post_id } = req.query;

  if (!post_id) {
    return res.status(400).json({ message: "Blog ID is required" });
  }

  try {
    const result = await pool.query(
      "SELECT c.id, c.content, c.created_at, u.username FROM comments c INNER JOIN users u ON c.user_id = u.id WHERE c.blog_id = $1 ORDER BY c.created_at ASC",
      [post_id]
    );

    res.status(200).json(result.rows);
  } catch (error) {
    next(error);
  }
};

module.exports = { addComment, getCommentsByBlogId };
