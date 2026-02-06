const mongoose = require("mongoose");

const detectionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null, // allows no-auth mode
    },
    input: {
      type: String,
      required: true,
    },
    result: {
      type: String,
      enum: ["phishing", "safe"],
      required: true,
    },
    threatLevel: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Detection", detectionSchema);
