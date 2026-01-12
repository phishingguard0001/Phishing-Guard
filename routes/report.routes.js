const express = require("express");
const router = express.Router();
const reportController = require("../controllers/report.controller");
const authMiddleware = require("../middlewares/auth.middleware");

router.post("/", authMiddleware, reportController.createReport);

module.exports = router;
