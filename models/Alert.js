const mongoose = require("mongoose");

const alertSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    message: String,
    status: { type: String, default: "unread" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Alert", alertSchema);
