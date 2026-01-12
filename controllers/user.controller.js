const User = require("../models/User");

// GET /api/users/me
exports.getProfile = async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  res.json(user);
};

// GET /api/users/all (admin only)
exports.getAllUsers = async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access denied" });
  }

  const users = await User.find().select("-password");
  res.json(users);
};
