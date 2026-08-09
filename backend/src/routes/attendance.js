const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');

const authenticate = require('../middleware/auth.middleware');
const wifiCheck = require('../middleware/wifiCheck');

// 🔍 Debug (optional)
console.log('Controller functions:', Object.keys(attendanceController));


// Student routes
router.post(
  '/mark',
  authenticate,
  wifiCheck,
  attendanceController.markAttendance
);
router.get('/today', authenticate, attendanceController.getTodayAttendance);
router.get('/history', authenticate, attendanceController.getAttendanceHistory);
router.get('/validate-wifi', authenticate, attendanceController.validateWifi);

// Warden routes
router.get('/report', authenticate, attendanceController.getAttendanceReport);
router.post('/auto-mark-absent', authenticate, attendanceController.autoMarkAbsent);

module.exports = router;