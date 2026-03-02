const axios = require("axios");

exports.detectEmail = async (text) => {
  const response = await axios.post(
    "http://127.0.0.1:5001/detect/email",
    { text }
  );

  return response.data;
};

exports.detectUrl = async (url) => {
  const response = await axios.post(
    "http://127.0.0.1:5001/detect/url",
    { url }
  );

  return response.data;
};