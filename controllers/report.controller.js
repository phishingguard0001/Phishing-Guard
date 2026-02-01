const Report = require("../models/Report");

exports.createReport = async (req, res) => {
  const report = await Report.create({
    user: req.user.id,
    url: req.body.url,
    description: req.body.description,
  });

  res.json(report);
};

exports.getAllReports = async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access only" });
  }

  const reports = await Report.find()
    .populate("user", "email")
    .sort({ createdAt: -1 });

  res.json(reports);
};
