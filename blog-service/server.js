require("dotenv").config();
const express = require("express");
const blogRoutes = require("./routes/blogRoutes");
const { connectDB } = require("./config/db");

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(express.json());

// Database Connection
connectDB();

// Routes
app.use("/api/blogs", blogRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    message: err.message || "Internal Server Error",
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
});

app.listen(PORT, () => console.log(`Blog service running on port ${PORT}`));
