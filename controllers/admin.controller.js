const Alert = require("../models/Alert");
const Url = require("../models/Url");
const Report = require("../models/Report");
const sendEmail = require("../utils/sendEmail");
const alertEmailTemplate = require("../utils/emailTemplate");

// PUSH ALERT TO USER
exports.sendAlert = async (req, res) => {
  const { email, message } = req.body;

  if (!email || !message) {
    return res.status(400).json({ message: "Email and message are required" });
  }

  const alert = await Alert.create({ email, message });

  await sendEmail({
    to: email,
    subject: "🚨 Security Alert from Phishing Guard",
    html: alertEmailTemplate(message),
  });

  res.json({ message: "Alert sent successfully", alert });
};



// UPDATE REPORT STATUS
exports.updateReportStatus = async (req, res) => {
  const { status } = req.body;

  const report = await Report.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true },
  );
u
  res.json(report);
};

exports.getAllUrls = async (req, res) => {
  const urls = await Url.find().sort({ createdAt: -1 });
  res.json(urls);
};


