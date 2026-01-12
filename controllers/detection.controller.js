const Detection = require("../models/Detection");
const phishingAnalyzer = require("../services/phishingAnalyzer");

// Analyze input
exports.analyze = async (req, res) => {
  const { input } = req.body;

  const result = phishingAnalyzer(input);

  const detection = await Detection.create({
    user: req.user.id,
    input,
    result: result.label,
    threatLevel: result.score,
  });

  res.json(detection);
};

// GET detection history
exports.history = async (req, res) => {
  try {
    const history = await Detection.find({ user: req.user.id })
      .sort({ createdAt: -1 });

    res.json(history);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch history" });
  }
};
