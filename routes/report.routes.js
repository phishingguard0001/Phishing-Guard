const express = require("express");
const router = express.Router();

const reportController = require("../controllers/report.controller");
const authMiddleware = require("../middlewares/auth.middleware");

// Create report
router.post("/", authMiddleware, reportController.createReport);

// Admin get all reports
router.get("/all", authMiddleware, reportController.getAllReports);

module.exports = router;