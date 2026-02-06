const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth.routes");
const attendanceRoutes = require("./routes/attendance");
const grievanceRoutes = require("./routes/grievanceRoutes");      // ✅ ADD
const feedbackRoutes = require("./routes/feedbackRoutes");        // ✅ ADD
const adminRoutes = require("./routes/admin.routes");             // ✅ ADD
const studentRoutes = require("./routes/student.routes");         // ✅ ADD
const noticesRoutes = require('./routes/noticeRoutes');
const app = express();
const { User, Student, Grievance } = require('./models');

app.set('trust proxy', true);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use((req, res, next) => {
  console.log(`\n📥 ${req.method} ${req.path}`);
  console.log(`   IP: ${req.ip}`);
  next();
});

// ✅ ALL ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/grievances", grievanceRoutes);      // ✅ ADD THIS
app.use("/api/feedback", feedbackRoutes);          // ✅ ADD THIS
app.use("/api/admin", adminRoutes);                // ✅ ADD THIS
app.use("/api/students", studentRoutes); 
app.use('/api/notices', noticesRoutes);          // ✅ ADD THIS

// Health check
app.get("/api/health", (req, res) => {
  res.json({ 
    success: true, 
    message: "Server is running",
    ip: req.ip
  });
});

// Test IP
app.get("/api/test-ip", (req, res) => {
  const forwarded = req.headers["x-forwarded-for"];
  const socketIp = req.socket.remoteAddress;
  
  res.json({
    message: "IP Detection Test",
    finalIP: (forwarded ? forwarded.split(',')[0].trim() : socketIp).replace('::ffff:', '')
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found"
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('❌ ERROR:', err.stack);
  res.status(500).json({
    success: false,
    message: "Internal server error",
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

module.exports = app;