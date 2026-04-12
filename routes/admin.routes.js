 const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth.middleware");
const adminOnly = require("../middlewares/admin.middleware");
const adminController = require("../controllers/admin.controller");
const authMiddleware = require("../middlewares/auth.middleware");

router.patch(
  "/reports/:id",
  auth,
  adminOnly,
  adminController.updateReportStatus,
);
router.get("/urls", auth, adminOnly, adminController.getAllUrls);

router.get("/stats", authMiddleware, adminController.getDashboardStats);
router.get("/reports-per-day", auth, adminOnly, adminController.getReportsPerDay);
router.post("/urls/:id/analyze", auth, adminOnly, adminController.analyzeUrl);
router.get("/urls/:id/report", auth, adminOnly, adminController.getUrlReport);
router.get("/detections", auth, adminOnly, adminController.getAllDetections);
router.delete("/urls/:id", auth, adminOnly, adminController.deleteUrl);

module.exports = router;
