const mongoose = require("./mongoose");

const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 5000,
  });

  console.log("MongoDB Connected (Atlas)");
};

module.exports = connectDB;
