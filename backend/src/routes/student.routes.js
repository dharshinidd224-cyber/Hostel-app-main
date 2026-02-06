const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");
const User = require("../models/User");

// GET logged-in student details
router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findOne({
      where: { user_id: req.user.user_id },
      attributes: ["user_id", "role"]
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // TEMP dummy mapping (until you have student table)
    res.json({
      name: "Rahul Sharma",
      room: "204",
      block: "A",
      userId: user.user_id
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch student data" });
  }
});

module.exports = router;
