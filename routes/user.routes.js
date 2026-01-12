// routes/user.routes.js
const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth.middleware");
const userController = require("../controllers/user.controller");

// USER ROUTES
router.get("/me", auth, userController.getProfile);

// ADMIN ROUTE (role-based)
router.get("/all", auth, userController.getAllUsers);

module.exports = router;
