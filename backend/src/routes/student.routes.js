const express = require("express");
const multer = require("multer");

console.log("🔥 STUDENT ROUTES LOADED");

const router = express.Router();

const auth = require("../middleware/auth.middleware");
const User = require("../models/User");

const studentController = require("../controllers/student.controller");


// Store uploaded images temporarily in RAM
const upload = multer({
  storage: multer.memoryStorage(),

  limits: {
    files: 5,
    fileSize: 5 * 1024 * 1024,
  },
});


// ========================================
// COMPLETE STUDENT REGISTRATION
// ========================================

router.post(
  "/register",
  upload.array("faceSamples", 5),
  (req, res, next) => {
    console.log("🔥 /api/students/register ROUTE HIT");
    next();
  },
  studentController.registerStudent
);

// ========================================
// GET LOGGED-IN STUDENT
// ========================================

router.get("/me", auth, async (req, res) => {

  try {

    const user = await User.findOne({
      where: {
        user_id: req.user.user_id,
      },

      attributes: [
        "user_id",
        "role",
      ],
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json({
      userId: user.user_id,
      role: user.role,
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      message: "Failed to fetch student data",
    });
  }
});


module.exports = router;