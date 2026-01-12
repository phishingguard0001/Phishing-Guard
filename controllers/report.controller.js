const Report = require("../models/Report");

exports.createReport = async (req, res) => {
  const report = await Report.create({
    user: req.user.id,
    url: req.body.url,
    description: req.body.description,
  });

  res.json(report);
};
