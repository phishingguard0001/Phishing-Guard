const keywordMatcher = require("../utils/keywordMatcher");

module.exports = function (input) {
  const suspicious = keywordMatcher(input);
  return {
    label: suspicious ? "Phishing" : "Safe",
    score: suspicious ? 80 : 10,
  };
};
