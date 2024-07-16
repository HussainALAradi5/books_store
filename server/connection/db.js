const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("connected to the database😁");
  } catch (error) {
    console.error("Database Connection error", error.message);
  }
};
module.exports = connectDB;
