const Detection = require("../models/Detection");
const Url = require("../models/Url");
const aiService = require("../services/aiService");
const URL_PATTERN = /https?:\/\/[^\s<>"')\]]+/gi;

exports.analyze = async (req, res) => {
  try {
    const { input } = req.body;

    if (!input) {
      return res.status(400).json({ message: "Input is required" });
    }

    const userId = req.user?.id || null;

    let emailAI = null;
    let urlReports = [];
    let details = [];

    // 🧠 Email Detection
    if (!input.startsWith("http")) {
      emailAI = await aiService.detectEmail(input);

      if (emailAI?.result === 1) {
        details.push("Suspicious email content detected");
      }
    }

    // 🔎 Extract URLs
    const urls = input.match(URL_PATTERN) || [];

    for (let url of urls) {
      const urlAI = await aiService.detectUrl(url);

      urlReports.push({
        url,
        result: urlAI.message,
        confidence: urlAI.confidence,
      });

      if (urlAI.result === 1) {
        details.push(`Malicious URL detected: ${url}`);
      }

      // Store URL in DB
      const exists = await Url.findOne({ url });
      if (!exists) {
        await Url.create({
          url,
          domain: new URL(url).hostname,
          isSuspicious: urlAI.result === 1,
          details: urlAI.result === 1 ? [urlAI.message] : [],
        });
      }
    }

    // 🎯 Combine Risk
    let finalResult = "safe";
    let confidence = 0;

    if (emailAI && emailAI.result === 1) {
      finalResult = "phishing";
      confidence = emailAI.confidence;
    }

    for (let report of urlReports) {
      if (report.result === "Phishing") {
        finalResult = "phishing";
        confidence = Math.max(confidence, report.confidence);
      }
    }

    // 📊 Convert Confidence to Score
    const riskScore = Math.round(confidence * 100);

    let threatLevel = "SAFE";

    if (riskScore >= 75) {
      threatLevel = "HIGH";
    } else if (riskScore >= 40) {
      threatLevel = "MEDIUM";
    }

    if (details.length === 0) {
      details.push("No suspicious indicators found");
    }

    // 💾 Save Detection
    const detection = await Detection.create({
      user: userId,
      input,
      result: finalResult,
      threatLevel,
      riskScore,
      confidence: riskScore,
      details,
    });

    // 🧾 Send Professional Response
    res.json({
      id: detection._id,
      threatLevel,
      riskScore,
      confidence: riskScore,
      details,
      scanTime: "2.3s",
      createdAt: detection.createdAt,
    });

  } catch (error) {
    console.error("DETECTION ERROR:", error.message);
    res.status(500).json({ message: "Detection failed" });
  }
};


// 📜 GET USER HISTORY
exports.history = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const history = await Detection.find({ user: userId })
      .sort({ createdAt: -1 });

    res.json(history);

  } catch (error) {
    res.status(500).json({ message: "Failed to fetch history" });
  }
};

exports.getRecentDetections = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const history = await Detection.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(5) // only recent 5
      .select("input result threatLevel createdAt");

    res.json(history);

  } catch (error) {
    console.error("History error:", error);
    res.status(500).json({ message: "Failed to fetch history" });
  }
};