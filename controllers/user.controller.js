const User = require("../models/User");

// GET /api/user/me
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching profile" });
  }
};

// PUT /api/user/profile
exports.updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, age, gender } = req.body;
    
    // Find User
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Update fields
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (age) user.age = age;
    if (gender) user.gender = gender;

    // Handle Profile Image Upload
    if (req.file) {
      // Create full path properly
      user.profileImage = `/uploads/${req.file.filename}`;
    }

    await user.save();

    // Return User WITHOUT password
    const updatedUser = await User.findById(req.user.id).select("-password");
    res.json({ message: "Profile updated successfully", user: updatedUser });

  } catch (error) {
    res.status(500).json({ message: "Error updating profile", error: error.message });
  }
};

// GET /api/user/all (admin only)
exports.getAllUsers = async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access denied" });
  }

  const users = await User.find().select("-password");
  res.json(users);
};

// PATCH /api/user/:id (admin only)
exports.updateUser = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access denied" });
    }

    const { email, role, name } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { email, role, name },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User updated successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Update failed", error: error.message });
  }
};

// DELETE /api/user/:id (admin only)
exports.deleteUser = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access denied" });
    }

    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Delete failed", error: error.message });
  }
};
