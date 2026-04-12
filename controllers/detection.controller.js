const Detection = require("../models/Detection");
const Url = require("../models/Url");
const aiService = require("../services/aiService");
const URL_PATTERN = /https?:\/\/[^\s<>"')\]]+/gi;

const TRUSTED_DOMAINS = [
  "google.com", "mozilla.org", "github.com", "microsoft.com", "wikipedia.org",
  "apple.com", "amazon.com", "facebook.com", "instagram.com", "linkedin.com",
  "netflix.com", "spotify.com", "twitter.com", "x.com", "bankofamerica.com",
  "chase.com", "paypal.com", "stackoverflow.com", "medium.com"
];

exports.analyze = async (req, res) => {
  try {
    const { input } = req.body;

    if (!input) {
      return res.status(400).json({ message: "Input is required" });
    }

    const userId = req.user?.id || null;
    let urlReports = [];
    let details = [];

    // 🔎 Extract URLs and limit to 10 for performance
    const originalUrls = [...new Set(input.match(URL_PATTERN) || [])];
    const urls = originalUrls.slice(0, 10);

    // 🧠 Parallel AI Analysis
    // We scan email body if it's long enough to contain text
    const emailPromise = (input.length >= 12)
      ? aiService.detectEmail(input) 
      : Promise.resolve(null);
    
    const urlPromises = urls.map(url => aiService.detectUrl(url).catch(err => ({ error: true, message: "Scan failed", result: 0, confidence: 0 })));

    const [emailAI, ...urlAIResults] = await Promise.all([emailPromise, ...urlPromises]);

    // 🎯 Process Findings
    for (let i = 0; i < urls.length; i++) {
      const url = urls[i];
      let urlAI = urlAIResults[i];

      // 🛡️ Whitelist Override: Check if domain is trusted
      try {
        const hostname = new URL(url).hostname.replace(/^www\./, "");
        const isWhitelisted = TRUSTED_DOMAINS.some(d => hostname === d || hostname.endsWith("." + d));
        
        if (isWhitelisted) {
          urlAI = { ...urlAI, result: 0, message: "Trusted Domain (Verified Safe)", confidence: 0 };
        }
      } catch (e) {}
      
      urlReports.push({
        url,
        result: urlAI.message,
        confidence: urlAI.confidence,
        rawResult: urlAI.result
      });

      // Async DB storage (don't block the main response)
      Url.findOne({ url }).then(exists => {
        if (!exists) {
          Url.create({
            url,
            domain: new URL(url).hostname,
            isSuspicious: urlAI.result === 1,
            details: urlAI.result === 1 ? [urlAI.message] : [],
          }).catch(e => console.error("URL save error:", e));
        }
      }).catch(e => console.error("URL check error:", e));
    }

    // 🎯 Combine Risk
    let finalResult = "safe";
    let confidence = 0;
    let indicators = 0;

    if (emailAI && emailAI.result === 1) {
      finalResult = "phishing";
      confidence = emailAI.confidence;
      indicators++;
    }

    for (let report of urlReports) {
      if (report.rawResult === 1 || report.result === "Phishing") {
        finalResult = "phishing";
        confidence = Math.max(confidence, report.confidence);
        indicators++;
      }
    }

    // 🚀 RISK BOOSTER: If multiple indicators found (Email + URL), boost the score by 15%
    if (indicators > 1) {
      confidence = Math.min(1.0, confidence + 0.15);
    }

    // 📊 Convert Confidence to Score
    const riskScore = Math.round(confidence * 100);

    let threatLevel = "SAFE";

    // 🛠️ UPDATED SENSITIVE THRESHOLDS (User Feedback: 65-80 should be medium/yellow)
    if (riskScore >= 80) {
      threatLevel = "HIGH";
    } else if (riskScore >= 40) {
      threatLevel = "MEDIUM";
    }

    // Ensure finalResult is "phishing" if any risk is detected
    if (threatLevel !== "SAFE") {
      finalResult = "phishing";
    }

    // Add findings based on final threat level
    if (threatLevel !== "SAFE") {
      if (emailAI && emailAI.result === 1) details.push("Suspicious email content detected");
      for (let report of urlReports) {
        if (report.rawResult === 1 || report.result === "Phishing") details.push(`Malicious URL detected: ${report.url}`);
      }
    }

    if (details.length === 0) {
      details.push("No suspicious indicators found");
    }

    // 💾 Save or Update Detection (Deduplication)
    const detection = await Detection.findOneAndUpdate(
      { user: userId, input },
      { 
        result: finalResult, 
        threatLevel, 
        riskScore, 
        confidence: riskScore, 
        details 
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    // 🧾 Send Professional Response
    res.json({
      id: detection._id,
      threatLevel,
      riskScore,
      confidence: riskScore,
      details,
      scanTime: "Parallel Mode",
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