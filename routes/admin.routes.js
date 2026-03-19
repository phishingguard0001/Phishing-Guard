const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth.middleware");
const adminOnly = require("../middlewares/admin.middleware");
const adminController = require("../controllers/admin.controller");
const authMiddleware = require("../middlewares/auth.middleware");

router.post("/alert", auth, adminOnly, adminController.sendAlert);
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

module.exports = router;
