const mongoose = require("mongoose");

const alertSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: "unread",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Alert", alertSchema);
