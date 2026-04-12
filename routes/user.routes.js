// routes/user.routes.js
const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth.middleware");
const userController = require("../controllers/user.controller");

const upload = require("../middlewares/upload.middleware");

// USER ROUTES
router.get("/me", auth, userController.getProfile);
router.put("/profile", auth, upload.single("profileImage"), userController.updateProfile);

// ADMIN ROUTE (role-based)
router.get("/all", auth, userController.getAllUsers);
router.patch("/:id", auth, userController.updateUser);
router.delete("/:id", auth, userController.deleteUser);

module.exports = router;
