const mongoose = require("mongoose");

const incidentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    type: String,
    status: { type: String, default: "open" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Incident", incidentSchema);
