const { Grievance, Student } = require("../models");

// Generate unique grievance ID
const generateGrievanceId = () => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `GRV${timestamp}${random}`.slice(0, 15);
};

// Student submits a grievance
exports.submitGrievance = async (req, res) => {
  console.log("🔥 Submit Grievance - REQ.USER:", req.user);
  console.log("🔥 Submit Grievance - REQ.BODY:", req.body);

  // Only students can submit grievances
  if (req.user.role !== 'student') {
    return res.status(403).json({ 
      message: "Only students can submit grievances" 
    });
  }

  try {
    const { category, priority, description, images } = req.body;

    // Validation
    if (!category || !description) {
      return res.status(400).json({ 
        message: "Category and description are required" 
      });
    }

    if (description.trim().length < 20) {
      return res.status(400).json({ 
        message: "Description must be at least 20 characters" 
      });
    }

    const grievanceId = generateGrievanceId();

    const grievance = await Grievance.create({
      grievance_id: grievanceId,
      user_id: req.user.user_id,
      category,
      priority: priority || 'medium',
      description,
      images: images || [],
      status: 'pending'
    });

    console.log("✅ Grievance created:", grievance.grievance_id);

    res.status(201).json({ 
      message: "Grievance submitted successfully",
      grievanceId: grievance.grievance_id
    });
  } catch (err) {
    console.error("❌ ERROR:", err);
    res.status(500).json({ message: "Failed to submit grievance" });
  }
};

// Student views their own grievances
exports.getMyGrievances = async (req, res) => {
  try {
    const grievances = await Grievance.findAll({
      where: { user_id: req.user.user_id },
      order: [["created_at", "DESC"]]
    });

    res.json(grievances);
  } catch (err) {
    console.error("❌ ERROR:", err);
    res.status(500).json({ message: "Failed to fetch grievances" });
  }
};

// Warden views all grievances
exports.getAllGrievances = async (req, res) => {
  try {
    const grievances = await Grievance.findAll({
      order: [["created_at", "DESC"]],
      include: [{
        model: Student,
        as: 'student',
        attributes: ['name', 'room_number', 'block_number'],
        required: false
      }]
    });

    console.log("✅ Fetched all grievances:", grievances.length);
    res.json(grievances);
  } catch (err) {
    console.error("❌ ERROR:", err);
    res.status(500).json({ message: "Failed to fetch grievances" });
  }
};

// Warden updates grievance status
exports.updateGrievanceStatus = async (req, res) => {
  console.log("🔥 Update Status - REQ.BODY:", req.body);

  // Only wardens can update status
  if (req.user.role !== 'warden') {
    return res.status(403).json({ 
      message: "Only wardens can update grievance status" 
    });
  }

  try {
    const { id } = req.params;
    const { status, resolution_remarks } = req.body;

    const grievance = await Grievance.findOne({
      where: { grievance_id: id }
    });

    if (!grievance) {
      return res.status(404).json({ message: "Grievance not found" });
    }

    await grievance.update({
      status,
      resolution_remarks: resolution_remarks || grievance.resolution_remarks
    });

    console.log("✅ Grievance updated:", id);

    res.json({ 
      message: "Grievance status updated successfully",
      grievance
    });
  } catch (err) {
    console.error("❌ ERROR:", err);
    res.status(500).json({ message: "Failed to update grievance" });
  }
};