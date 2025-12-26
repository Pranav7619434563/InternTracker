require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const connectDB = require("./config/db");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Serve static files from uploads directory
app.use("/uploads", express.static("uploads"));

const PORT = process.env.PORT || 5000;

// 🔴 START SERVER ONLY AFTER DB IS 100% READY
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // 🔴 HARD GUARANTEE: wait until mongoose is fully connected
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connection.asPromise();
    }

    // Routes (ONLY AFTER DB IS READY)
    app.use("/api/auth", require("./routes/authRoutes"));
    app.use("/api/internships", require("./routes/internshipRoutes"));
    app.use("/api/upload", require("./routes/uploadRoutes"));

    // Root route
    app.get("/", (req, res) => {
      res.json({ message: "Welcome to Internship Tracker API" });
    });

    // Error handling middleware
    app.use((err, req, res, next) => {
      console.error(err.stack);
      res.status(500).json({ message: err.message || "Something went wrong!" });
    });

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
};

startServer();
