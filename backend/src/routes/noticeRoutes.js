const express = require("express");
const router = express.Router();
const Notice = require("../models/Notice");
const User = require("../models/User");
const authMiddleware = require("../middleware/auth.middleware");

// GET all notices (no auth required for students to view)
router.get("/", async (req, res) => {
  try {
    const notices = await Notice.findAll({
      where: { is_active: true },
      order: [["created_at", "DESC"]],
    });

    console.log("✅ Fetched all notices:", notices.length);
    res.json(notices);
  } catch (error) {
    console.error("❌ Error fetching notices:", error);
    res.status(500).json({ error: "Failed to fetch notices" });
  }
});

// POST create a new notice (warden only)
router.post("/", authMiddleware, async (req, res) => {
  try {
    console.log("🔥 POST /notices - REQ.USER:", req.user);
    console.log("🔥 POST /notices - REQ.BODY:", req.body);

    // Only wardens can create notices
    if (req.user.role !== 'warden') {
      return res.status(403).json({ 
        error: "Only wardens can create notices" 
      });
    }

    const {
      type,
      title,
      message,
      priority,
      category,
      targets,
      scheduled_date,
      scheduled_time,
      attachments,
    } = req.body;

    // Validate required fields
    if (!title || !message) {
      return res.status(400).json({ 
        error: "Title and message are required" 
      });
    }

    // ✅ Use user_id from token (consistent with other controllers)
    const warden_id = req.user.user_id;
    
    // ✅ Get warden name from User table
    const warden = await User.findOne({ 
      where: { user_id: warden_id } 
    });
    const warden_name = warden ? `Warden ${warden_id}` : "Unknown Warden";

    // Generate notice ID
    const timestamp = Date.now();
    const notice_id = `NOT${timestamp}`;

    const newNotice = await Notice.create({
      notice_id,
      type: type || "notice",
      title,
      message,
      priority: priority || "normal",
      category: category || "General",
      warden_id,
      warden_name,
      targets: targets || [],
      scheduled_date,
      scheduled_time,
      attachments: attachments || [],
    });

    console.log("✅ Notice created:", newNotice.notice_id, "by warden:", warden_id);
    res.status(201).json(newNotice);
  } catch (error) {
    console.error("❌ Error creating notice:", error);
    
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ 
        error: "Validation error",
        details: error.errors.map(e => e.message)
      });
    }
    
    res.status(500).json({ error: "Failed to create notice" });
  }
});

// PATCH update notice (warden only, own notices)
router.patch("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (req.user.role !== 'warden') {
      return res.status(403).json({ 
        error: "Only wardens can update notices" 
      });
    }

    const notice = await Notice.findOne({ where: { notice_id: id } });

    if (!notice) {
      return res.status(404).json({ error: "Notice not found" });
    }

    // Check if user is the owner
    if (notice.warden_id !== req.user.user_id) {
      return res.status(403).json({ 
        error: "You can only update your own notices" 
      });
    }

    await notice.update(updateData);

    console.log("✅ Notice updated:", notice.notice_id);
    res.json(notice);
  } catch (error) {
    console.error("❌ Error updating notice:", error);
    res.status(500).json({ error: "Failed to update notice" });
  }
});

// DELETE notice (soft delete, warden only)
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user.role !== 'warden') {
      return res.status(403).json({ 
        error: "Only wardens can delete notices" 
      });
    }

    const notice = await Notice.findOne({ where: { notice_id: id } });

    if (!notice) {
      return res.status(404).json({ error: "Notice not found" });
    }

    // Check if user is the owner
    if (notice.warden_id !== req.user.user_id) {
      return res.status(403).json({ 
        error: "You can only delete your own notices" 
      });
    }

    await notice.update({ is_active: false });

    console.log("✅ Notice deleted:", notice.notice_id);
    res.json({ message: "Notice deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting notice:", error);
    res.status(500).json({ error: "Failed to delete notice" });
  }
});

module.exports = router;