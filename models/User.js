// models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  age: Number,
  gender: {
    type: String,
    enum: ["Male", "Female", "Other", "Prefer Not to Say"],
  },
  profileImage: String,
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  resetPasswordOTP: String,
  resetPasswordExpires: Date,
});
 
module.exports = mongoose.model("User", userSchema);
