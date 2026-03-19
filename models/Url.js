const mongoose = require("mongoose");

const urlSchema = new mongoose.Schema(
  {
    url: String,
    domain: String,
    isSuspicious: Boolean,
    details: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Url", urlSchema);
 