const express = require("express");
const router = express.Router();
const detectionController = require("../controllers/detection.controller");
const authMiddleware = require("../middlewares/auth.middleware");

// With auth
router.post("/analyze", authMiddleware, detectionController.analyze);
router.get("/history", authMiddleware, detectionController.history); // full history
router.get("/recent", authMiddleware, detectionController.getRecentDetections); // recent 5

module.exports = router;
