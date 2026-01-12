const express = require("express");
const router = express.Router();
const detectionController = require("../controllers/detection.controller");
const authMiddleware = require("../middlewares/auth.middleware");

router.post("/analyze", authMiddleware, detectionController.analyze);

// NEW: Detection history
router.get("/history", authMiddleware, detectionController.history);

module.exports = router;
