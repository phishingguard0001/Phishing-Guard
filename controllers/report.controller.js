const Report = require("../models/Report");

/**
 * @desc    Create new report
 * @route   POST /api/report
 * @access  Private (User)
 */
exports.createReport = async (req, res) => {
  try {
    const { url, threatLevel, riskScore, confidence, details } = req.body;

    if (!url) {
      return res.status(400).json({ message: "URL is required" });
    }

    const report = await Report.create({
      user: req.user.id,
      url,
      threatLevel,
      riskScore,
      confidence,
      details,
    });

    res.status(201).json({
      success: true,
      message: "Report created successfully",
      report,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create report",
      error: error.message,
    });
  }
};


/**
 * @desc    Get all reports (Admin only)
 * @route   GET /api/report/all
 * @access  Private (Admin)
 */
exports.getAllReports = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Admin access only",
      });
    }

    const reports = await Report.find()
      .populate("user", "email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reports.length,
      reports,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch reports",
      error: error.message,
    });
  }
};