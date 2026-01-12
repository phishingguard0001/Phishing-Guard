module.exports = function (url) {
  return url.includes("login") || url.includes("verify");
};
