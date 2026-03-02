const Alert = require("../models/Alert");
const Url = require("../models/Url");
const Report = require("../models/Report");
const sendEmail = require("../utils/sendEmail");
const alertEmailTemplate = require("../utils/emailTemplate");

// PUSH ALERT TO USER
exports.sendAlert = async (req, res) => {
  try {
    const { email, message } = req.body;

    if (!email || !message) {
      return res.status(400).json({
        message: "Email and message are required",
      });
    }

    const alert = await Alert.create({ email, message });

    await sendEmail({
      to: email,
      subject: "🚨 Security Alert from Phishing Guard",
      html: alertEmailTemplate(message),
    });

    res.json({ message: "Alert sent successfully", alert });
  } catch (error) {
    console.error("SEND ALERT ERROR 👉", error);
    res.status(500).json({
      message: "Failed to send alert",
      error: error.message, // TEMP: helps debugging
    });
  }
};

// UPDATE REPORT STATUS
exports.updateReportStatus = async (req, res) => {
  const { status } = req.body;

  const report = await Report.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true },
  );
  u;
  res.json(report);
};

exports.getAllUrls = async (req, res) => {
  const urls = await Url.find().sort({ createdAt: -1 });
  res.json(urls);
};

exports.getDashboardStats = async (req, res) => {
  try {
    // 🔐 Admin check
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access only" });
    }

    // 📊 Report Counts
    const totalReports = await Report.countDocuments();

    const high = await Report.countDocuments({
      threatLevel: "HIGH",
    });

    const medium = await Report.countDocuments({
      threatLevel: "MEDIUM",
    });

    const safe = await Report.countDocuments({
      threatLevel: "SAFE",
    });

    // 🚨 Alerts = all non-safe
    const totalAlerts = await Report.countDocuments({
      threatLevel: { $ne: "SAFE" },
    });

    // 🔗 Suspicious URLs
    const suspiciousUrls = await Url.countDocuments({
      isSuspicious: true,
    });

    res.json({
      totalReports,
      high,
      medium,
      safe,
      totalAlerts,
      suspiciousUrls,
    });
  } catch (error) {
    console.error("Dashboard Stats Error:", error);
    res.status(500).json({
      message: "Failed to load dashboard stats",
    });
  }
};

exports.getReportsPerDay = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access only" });
    }

    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 6);

    const reports = await Report.aggregate([
      {
        $match: {
          createdAt: { $gte: last7Days },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json(reports);
  } catch (error) {
    console.error("Reports per day error:", error);
    res.status(500).json({ message: "Failed to fetch reports per day" });
  }
};
