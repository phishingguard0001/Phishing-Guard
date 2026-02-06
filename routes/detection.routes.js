const express = require("express");
const router = express.Router();
const detectionController = require("../controllers/detection.controller");

// No auth (for testing)
router.post("/analyze", detectionController.analyze);

module.exports = router;
