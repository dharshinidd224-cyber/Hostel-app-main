const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");
console.log("🔥 feedbackRoutes file LOADED");

const {
  submitFeedback,
  getAllFeedback
} = require("../controllers/feedbackController");

// ✅ STUDENT submits feedback
router.post("/", auth, (req, res, next) => {
  console.log("🔥 POST /api/feedback HIT");
  next();
}, submitFeedback);


// ✅ WARDEN views all feedback
router.get("/", auth, getAllFeedback);

module.exports = router;
