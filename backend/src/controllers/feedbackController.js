const { Feedback, Student } = require("../models");  // ✅ Import from models/index.js

exports.submitFeedback = async (req, res) => {
  console.log("🔥 HIT submitFeedback");
  console.log("REQ.USER =", req.user);
  console.log("REQ.BODY =", req.body);
  if (req.user.role !== 'student') {
    return res.status(403).json({ 
      message: "Only students can submit feedback" 
    });
  }
  
  try {
    const { anonymous, categories } = JSON.parse(req.body.message);
    
    // ✅ Create multiple feedback entries (one per category)
    const feedbackEntries = await Promise.all(
      categories.map(cat => 
        Feedback.create({
          user_id: req.user.user_id,
          category: cat.category,
          rating: cat.rating,
          comment: cat.comment || null,
          anonymous: anonymous,
          status: 'pending'
        })
      )
    );

    res.status(201).json({ 
      message: "Feedback submitted successfully",
      count: feedbackEntries.length 
    });
  } catch (err) {
    console.error("❌ ERROR:", err);
    res.status(500).json({ message: "Failed to submit feedback" });
  }
};

exports.getAllFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findAll({
      order: [["created_at", "DESC"]],
      include: [{
        model: Student,
        as: 'student',
        attributes: ['name', 'room_number', 'block_number'],
        required: false
      }]
    });
    
    console.log("✅ FETCHED FEEDBACK:", feedback.length);
    res.json(feedback);
  } catch (err) {
    console.error("❌ ERROR:", err);
    res.status(500).json({ message: "Failed to fetch feedback" });
  }
};