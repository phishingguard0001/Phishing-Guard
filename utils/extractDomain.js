module.exports = function (url) {
  return new URL(url).hostname;
};
