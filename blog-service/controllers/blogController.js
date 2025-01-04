const { pool } = require("../config/db");

const createBlog = async (req, res, next) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({ message: "Title and content are required" });
  }

  try {
    const result = await pool.query(
      "INSERT INTO blogs (user_id, title, content) VALUES ($1, $2, $3) RETURNING *",
      [req.user.id, title, content]
    );

    res.status(201).json(result.rows[0]);
  } 
  catch (error) {
    next(error);
  }
};

const getBlogs = async (req, res, next) => {
  const { page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;

  try {
    const result = await pool.query(
      "SELECT * FROM blogs ORDER BY created_at DESC LIMIT $1 OFFSET $2",
      [limit, offset]
    );

    res.status(200).json(result.rows);
  }
  catch (error) {
    next(error);
  }
};

const getBlogById = async (req, res, next) => {
  try {
    const result = await pool.query("SELECT * FROM blogs WHERE id = $1", [
      req.params.id,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.status(200).json(result.rows[0]);
  } 
  catch (error) {
    next(error);
  }
};

const updateBlog = async (req, res, next) => {
  const { title, content } = req.body;

  try {
    const result = await pool.query(
      "UPDATE blogs SET title = $1, content = $2, updated_at = NOW() WHERE id = $3 AND user_id = $4 RETURNING *",
      [title, content, req.params.id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Blog not found or not authorized" });
    }

    res.status(200).json(result.rows[0]);
  }
  catch (error) {
    next(error);
  }
};

const deleteBlog = async (req, res, next) => {
  try {
    const result = await pool.query(
      "DELETE FROM blogs WHERE id = $1 AND user_id = $2 RETURNING *",
      [req.params.id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Blog not found or not authorized" });
    }

    res.status(200).json({ message: "Blog deleted successfully" });
  }
  catch (error) {
    next(error);
  }
};

module.exports = { createBlog, getBlogs, getBlogById, updateBlog, deleteBlog };
