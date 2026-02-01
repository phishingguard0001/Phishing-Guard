const mongoose = require("mongoose");

const urlSchema = new mongoose.Schema(
  {
    url: String,
    domain: String,
    isSuspicious: Boolean,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Url", urlSchema);
 