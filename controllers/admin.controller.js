const Url = require("../models/Url");
const Report = require("../models/Report");
const Detection = require("../models/Detection");
const aiService = require("../services/aiService");

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

    // 📊 Detection scan counts (AI scan results)
    const totalReports = await Detection.countDocuments();

    // 📋 User-submitted reports
    const totalUserReports = await Report.countDocuments();

    // 🔴 High Risk = unique suspicious URLs tracked (matches Suspicious URLs page)
    const high = await Url.countDocuments({ isSuspicious: true });

    const medium = await Detection.countDocuments({ threatLevel: "MEDIUM" });
    const safe = await Detection.countDocuments({ threatLevel: "SAFE" });

    // 🚨 Alerts = all non-safe detections
    const totalAlerts = await Detection.countDocuments({
      threatLevel: { $ne: "SAFE" },
    });

    // 🔗 Suspicious URLs
    const suspiciousUrls = await Url.countDocuments({ isSuspicious: true });

    res.json({
      totalReports,
      totalUserReports,
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

    const last30Days = new Date();
    last30Days.setDate(last30Days.getDate() - 29);

    const reports = await Detection.aggregate([
      { $match: { createdAt: { $gte: last30Days } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
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

// 🔍 ON-DEMAND URL ANALYSIS
exports.analyzeUrl = async (req, res) => {
  try {
    const Detection = require("../models/Detection");
    const urlDoc = await Url.findById(req.params.id);

    if (!urlDoc) {
      return res.status(404).json({ message: "URL not found" });
    }

    // 1️⃣ Find Detection records that contain this URL
    const escapedUrl = urlDoc.url.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const detections = await Detection.find({
      input: { $regex: escapedUrl, $options: "i" },
    }).sort({ createdAt: -1 }).limit(5);

    let details = [];

    if (detections.length > 0) {
      // Collect all unique details from Detection records
      const allDetails = detections.flatMap(d => d.details || []);
      details = [...new Set(allDetails)].filter(Boolean);

      // If still empty, build a meaningful summary from detection metadata
      if (details.length === 0) {
        const latest = detections[0];
        if (latest.threatLevel) details.push(`Threat Level: ${latest.threatLevel}`);
        if (latest.riskScore != null) details.push(`Risk Score: ${latest.riskScore}/100`);
        if (latest.confidence != null) details.push(`Confidence: ${latest.confidence}%`);
        if (latest.scanType) details.push(`Scan Type: ${latest.scanType}`);
      }
    }

    // 2️⃣ If still no details, fall back to fresh AI analysis
    if (details.length === 0) {
      try {
        const result = await aiService.detectUrl(urlDoc.url);
        if (result.message) details.push(`Classification: ${result.message}`);
        if (result.confidence) details.push(`Confidence: ${result.confidence}%`);
        if (result.result != null) details.push(`AI Result: ${result.result === 1 ? "Phishing detected" : "Looks safe"}`);
        urlDoc.isSuspicious = result.result === 1;
      } catch (aiErr) {
        details.push("AI analysis unavailable — URL was flagged as suspicious during a user scan.");
      }
    }

    if (details.length === 0) {
      details.push("This URL was flagged as suspicious by the AI engine. No additional details are stored.");
    }

    // 3️⃣ Save details to the URL record
    urlDoc.details = details;
    await urlDoc.save();

    res.json({ details, isSuspicious: urlDoc.isSuspicious });
  } catch (error) {
    console.error("analyzeUrl error:", error);
    res.status(500).json({ message: "Failed to analyze URL" });
  }
};

// 📄 GET FULL DETAILED REPORT FOR URL
exports.getUrlReport = async (req, res) => {
  try {
    const Detection = require("../models/Detection");
    const urlDoc = await Url.findById(req.params.id);

    if (!urlDoc) {
      return res.status(404).json({ message: "URL not found" });
    }

    // Find the latest Detection scan that actually contained this URL
    const detection = await Detection.findOne({
      input: { $regex: urlDoc.url.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), $options: "i" },
    }).sort({ createdAt: -1 });

    if (!detection) {
      return res.status(404).json({ message: "No active scan report found for this URL" });
    }

    res.json(detection);
  } catch (error) {
    console.error("getUrlReport error:", error);
    res.status(500).json({ message: "Failed to fetch URL report" });
  }
};

// 📋 GET ALL DETECTION SCANS (admin view)
exports.getAllDetections = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access only" });
    }
    const detections = await Detection.find()
      .populate("user", "email name")
      .sort({ createdAt: -1 });
    res.json(detections);
  } catch (error) {
    console.error("getAllDetections error:", error);
    res.status(500).json({ message: "Failed to fetch detections" });
  }
};

// 🗑️ DELETE A URL
exports.deleteUrl = async (req, res) => {
  try {
    const deleted = await Url.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "URL not found" });
    }
    res.json({ message: "URL deleted successfully" });
  } catch (error) {
    console.error("deleteUrl error:", error);
    res.status(500).json({ message: "Failed to delete URL" });
  }
};
