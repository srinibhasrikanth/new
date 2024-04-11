const mongoose = require("mongoose");

const authSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    rollNumber: {
      type: String,
    },
    year: {
      type: String,
    },
    department: {
      type: String,
    },
    section: {
      type: String,
    },
    phoneNumber: {
      type: String,
    },
    email: {
      type: String,
    },
    username: {
      type: String,
      default: function () {
        return this.rollNumber; // Set username default value to rollNumber
      },
    },
    password: {
      type: String,
    },
    role: {
      type: String,
    },
  },
  { timestamps: true }
);

const authModel = mongoose.model("auth", authSchema);

module.exports = authModel;
