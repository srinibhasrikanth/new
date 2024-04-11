const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO);
    console.log(`MongoDB is connected successfully`);
  } catch (error) {
    console.log(`Error in connecting to MONGO`);
  }
};

module.exports = connectDB;
