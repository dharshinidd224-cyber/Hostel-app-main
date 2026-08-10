
const app = require("./src/app");
const { sequelize } = require("./src/config/db");
require("dotenv").config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();
const attendanceRoutes = require('./src/routes/attendance');
const grievanceRoutes = require('./src/routes/grievanceRoutes');
const PORT = process.env.PORT || 5000;

app.use(helmet());
app.use(cors({
  origin: [
    'http://localhost:3000',           // For localhost development
    'http://192.168.106.191:3000',     // For network access
    'http://127.0.0.1:3000',
    'http://10.62.62.163:3000'           // Alternative localhost
  ],
  credentials: true
}));
app.use(express.json());
app.use('/api/attendance', attendanceRoutes);
app.use('/api/grievances', grievanceRoutes);

app._router.stack.forEach((middleware) => {
  if (middleware.route) {
    console.log("ROUTE:", middleware.route.path);
  } else if (middleware.name === 'router') {
    middleware.handle.stack.forEach((handler) => {
      if (handler.route) {
        console.log("ROUTE:", handler.route.path);
      }
    });
  }
});

app.set('trust proxy', true);

sequelize.authenticate()
  .then(() => {
    console.log("MySQL connected");
    return sequelize.sync();
  })
  .then(() => {
    app.listen(PORT, '0.0.0.0', () => {
  console.log(`
  ✅ Server running on:
  - Local:   http://localhost:${PORT}
  - Network: http://192.168.106.191:${PORT}
  `);
});
  })
  .catch(err => {
    console.error("❌ Database connection failed:");
console.error(err);
  });
