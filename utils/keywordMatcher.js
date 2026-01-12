const keywords = ["verify", "login", "urgent", "bank"];

module.exports = function (text) {
  return keywords.some((k) => text.toLowerCase().includes(k));
};
