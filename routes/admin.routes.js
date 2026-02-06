const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth.middleware");
const adminOnly = require("../middlewares/admin.middleware");
const adminController = require("../controllers/admin.controller");

router.post("/alert", auth, adminOnly, adminController.sendAlert);
router.patch("/reports/:id", auth, adminOnly, adminController.updateReportStatus);
router.get("/urls", auth, adminOnly, adminController.getAllUrls);

module.exports = router;
