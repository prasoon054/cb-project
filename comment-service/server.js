require("dotenv").config();
const express = require("express");
const commentRoutes = require("./routes/commentRoutes");
const { connectDB } = require("./config/db");

const app = express();
const PORT = process.env.PORT || 5002;

app.use(express.json());

connectDB();

app.use("/api/comments", commentRoutes);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    message: err.message || "Internal Server Error",
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
});

app.listen(PORT, () => console.log(`Comment service running on port ${PORT}`));
