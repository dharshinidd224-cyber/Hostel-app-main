const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Student = require("../models/Student");

exports.register = async (req, res) => {
  console.log("REGISTER BODY:", req.body);

  try {
    const {
      collegeId,
      password,
      role,
      name,
      roomNumber,
      blockNumber,
      department,
      phoneNumber,
      year
    } = req.body;
const userId = collegeId;
    // 🔎 Check if user already exists
    const existingUser = await User.findOne({
      where: { user_id: userId }
    });

    if (existingUser) {
      return res.status(409).json({
        message: "College ID already registered"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      user_id: userId,
      password: hashedPassword,
      role
    });

    if (role === "student") {
      await Student.create({
        user_id: userId,
        name,
        room_number: roomNumber,
        block_number: blockNumber,
        department,
        phone_number: phoneNumber,
        year
      });
    }

    console.log("REGISTER BODY:", req.body);

    res.status(201).json({
      message: "User registered successfully"
    });

  } catch (error) {
    console.error("REGISTER ERROR:", error);
    res.status(500).json({
      message: "Server error during registration"
    });
  }
};

exports.me = async (req, res) => {
  try {
    const student = await Student.findOne({
      where: { user_id: req.user.user_id }
    });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json({
      name: student.name,
      roomNumber: student.room_number,
      blockNumber: student.block_number
    });
  } catch (err) {
    console.error("ME ERROR:", err);
    res.status(500).json({ message: "Failed to fetch student data" });
  }
};



exports.login = async (req, res) => {
  console.log('📥 Login Request Body:', req.body);  // Add this line
  console.log('📥 user_id:', req.body.user_id);  
  const { userId, password } = req.body;

  const user = await User.findOne({
    where: { user_id: userId }
  });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign(
  {
    user_id: user.user_id, // CS123456 / STAFF1234
    role: user.role
  },
  process.env.JWT_SECRET,
  { expiresIn: "1h" }
);


  res.json({ token });
};



