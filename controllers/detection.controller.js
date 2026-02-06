const Detection = require("../models/Detection");
const Url = require("../models/Url");
const phishingAnalyzer = require("../services/phishingAnalyzer");

// ANALYZE INPUT (URL / TEXT)
exports.analyze = async (req, res) => {
  try {
    const { input } = req.body;

    if (!input) {
      return res.status(400).json({ message: "Input is required" });
    }

    const rawResult = phishingAnalyzer(input);

    // normalize result
    const result = {
      label: rawResult.label.toLowerCase(), // phishing | safe
      score: rawResult.score,
    };

    const userId = req.user?.id || null;

    // Save detection history
    const detection = await Detection.create({
      user: userId,
      input,
      result: result.label,
      threatLevel: result.score,
    });

    // ---- URL STORAGE (SAFE + PHISHING) ----
    if (input.startsWith("http")) {
      try {
        const domain = new URL(input).hostname;

        const exists = await Url.findOne({ url: input });

        if (!exists) {
          await Url.create({
            url: input,
            domain,
            isSuspicious: result.label === "phishing",
          });
        }
      } catch (err) {
        console.error("Invalid URL:", err.message);
      }
    }

    res.json(detection);
  } catch (error) {
    console.error("DETECTION ERROR:", error);
    res.status(500).json({ message: "Detection failed" });
  }
};

// GET DETECTION HISTORY (auth only)
exports.history = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const history = await Detection.find({ user: userId }).sort({
      createdAt: -1,
    });

    res.json(history);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch history" });
  }
};
