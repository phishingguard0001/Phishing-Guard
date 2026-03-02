const axios = require("axios");

exports.detectEmail = async (text) => {
  const response = await axios.post(
    "https://phishing-guard-ai.onrender.com/detect/email",
    { text }
  );

  return response.data;
};

exports.detectUrl = async (url) => {
  const response = await axios.post(
    "https://phishing-guard-ai.onrender.com/detect/url",
    { url }
  );

  return response.data;
};