const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth.middleware");
const adminOnly = require("../middlewares/admin.middleware");
const adminController = require("../controllers/admin.controller");

router.post("/alert", auth, adminOnly, adminController.sendAlert);
router.post("/urls", auth, adminOnly, adminController.addSuspiciousUrl);
router.patch("/reports/:id", auth, adminOnly, adminController.updateReportStatus);
router.get("/urls", auth, adminOnly, adminController.getAllUrls);
router.post("/urls", auth, adminOnly, adminController.addUrl);

module.exports = router;
