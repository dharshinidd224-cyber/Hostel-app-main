const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");
const User = require("../models/User");
const attendanceController = require('../controllers/attendanceController');
const authMiddleware = require('../middleware/auth.middleware');

router.get("/dashboard", auth, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied" });
  }

  const totalUsers = await User.count();
  res.json({ totalUsers });
});

router.get("/validate-wifi", attendanceController.validateWifi);

// ✅ Student attendance endpoints (auth required)
router.post("/mark", authMiddleware, attendanceController.markAttendance);
router.get("/today", authMiddleware, attendanceController.getTodayAttendance);
router.get("/history", authMiddleware, attendanceController.getAttendanceHistory);

// ✅ Warden endpoints (should add admin/warden auth middleware)
router.get("/report", authMiddleware, attendanceController.getAttendanceReport);
router.post("/auto-mark-absent", authMiddleware, attendanceController.autoMarkAbsent);

module.exports = router;
