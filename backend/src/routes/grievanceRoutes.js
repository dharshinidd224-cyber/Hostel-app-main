const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");

const {
  submitGrievance,
  getMyGrievances,
  getAllGrievances,
  updateGrievanceStatus
} = require("../controllers/grievanceController");

// Student routes
router.post("/", auth, submitGrievance);              // Submit grievance
router.get("/my-grievances", auth, getMyGrievances);  // View my grievances

// Warden routes
router.get("/", auth, getAllGrievances);              // View all grievances
router.patch("/:id/status", auth, updateGrievanceStatus); // Update status

module.exports = router;