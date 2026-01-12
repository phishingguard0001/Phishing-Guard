const mongoose = require("mongoose");

const emailSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    content: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Email", emailSchema);
