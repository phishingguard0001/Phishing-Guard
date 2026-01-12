const mongoose = require("mongoose");

const detectionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    input: String,
    result: String,
    threatLevel: Number,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Detection", detectionSchema);
