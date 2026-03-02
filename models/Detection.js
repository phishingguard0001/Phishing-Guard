const mongoose = require("mongoose");

const detectionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
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
      type: String,
      enum: ["SAFE", "MEDIUM", "HIGH"],
      required: true,
    },
    riskScore: {
      type: Number,
      min: 0,
      max: 100,
      required: true,
    },
    confidence: {
      type: Number,
      min: 0,
      max: 100,
      required: true,
    },
    details: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Detection", detectionSchema);