const Alert = require("../models/Alert");
const Url = require("../models/Url");
const Report = require("../models/Report");

// PUSH ALERT TO USER
exports.sendAlert = async (req, res) => {
  const { userId, message } = req.body;

  const alert = await Alert.create({
    user: userId,
    message
  });

  res.json(alert);
};

// ADD SUSPICIOUS URL
exports.addSuspiciousUrl = async (req, res) => {
  const { url, domain, isSuspicious } = req.body;

  const record = await Url.create({
    url,
    domain,
    isSuspicious
  });

  res.json(record);
};

// UPDATE REPORT STATUS
exports.updateReportStatus = async (req, res) => {
  const { status } = req.body;

  const report = await Report.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true }
  );

  res.json(report);
};

exports.getAllUrls = async (req, res) => {
  const urls = await Url.find().sort({ createdAt: -1 });
  res.json(urls);
};

// ADD suspicious URL
exports.addUrl = async (req, res) => {
  const { url, domain, isSuspicious } = req.body;

  if (!url || !domain) {
    return res.status(400).json({ message: "URL and domain are required" });
  }

  const record = await Url.create({
    url,
    domain,
    isSuspicious: isSuspicious ?? true,
  });

  res.json(record);
};