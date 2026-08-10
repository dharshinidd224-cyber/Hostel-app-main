const bcrypt = require("bcryptjs");

const {
  sequelize,
  User,
  Student,
  FaceEmbedding,
} = require("../models");

const FLASK_URL =
  process.env.FACE_SERVICE_URL || "http://localhost:5001";


exports.registerStudent = async (req, res) => {
  let transaction;

  try {
    console.log("\n=================================");
    console.log("📝 COMPLETE STUDENT REGISTRATION");
    console.log("=================================");

    const {
      name,
      collegeId,
      roomNumber,
      blockNumber,
      department,
      phoneNumber,
      year,
      password,
      confirmPassword,
    } = req.body;

    const faceSamples = req.files;

    // --------------------------------
    // Validate student details
    // --------------------------------

    if (
      !name ||
      !collegeId ||
      !roomNumber ||
      !blockNumber ||
      !department ||
      !phoneNumber ||
      !year ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message: "All student details are required.",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match.",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters.",
      });
    }

    // --------------------------------
    // Validate face samples
    // --------------------------------

    if (!faceSamples || faceSamples.length !== 5) {
      return res.status(400).json({
        success: false,
        message: "Exactly 5 face samples are required.",
      });
    }

    console.log("College ID:", collegeId);
    console.log("Student:", name);
    console.log("Face samples:", faceSamples.length);

    // --------------------------------
    // Validate uploaded files
    // --------------------------------

    for (const file of faceSamples) {
      if (!file.mimetype.startsWith("image/")) {
        return res.status(400).json({
          success: false,
          message: "All face samples must be images.",
        });
      }
    }

    // --------------------------------
    // Check existing user
    // --------------------------------

    const existingUser = await User.findOne({
      where: {
        user_id: collegeId,
      },
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "College ID already registered.",
      });
    }

    // --------------------------------
    // Convert images to Base64
    // --------------------------------

    const samples = faceSamples.map((file) => {
      return `data:${file.mimetype};base64,${file.buffer.toString(
        "base64"
      )}`;
    });

    // --------------------------------
    // Send images to Flask
    // --------------------------------

    console.log("🔄 Sending images to Face Service...");

    const flaskResponse = await fetch(
      `${FLASK_URL}/register-face`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          samples,
        }),
      }
    );

    if (!flaskResponse.ok) {
      throw new Error(
        `Face service HTTP error: ${flaskResponse.status}`
      );
    }

    const faceResult = await flaskResponse.json();

    console.log(
      "Face service response:",
      faceResult.success
    );

    // --------------------------------
    // Face recognition validation
    // --------------------------------

    if (!faceResult.success) {
      return res.status(400).json({
        success: false,
        message:
          faceResult.message ||
          "Face registration failed.",
        sample: faceResult.sample || null,
      });
    }

    const embeddings = faceResult.embeddings;

    if (
      !Array.isArray(embeddings) ||
      embeddings.length !== 5
    ) {
      throw new Error(
        "Face service did not return exactly 5 embeddings."
      );
    }

    // Every InsightFace embedding must be 512-dimensional
    for (let i = 0; i < embeddings.length; i++) {
      if (
        !Array.isArray(embeddings[i]) ||
        embeddings[i].length !== 512
      ) {
        throw new Error(
          `Invalid embedding for sample ${i + 1}.`
        );
      }
    }

    console.log("✅ 5 valid 512-dimensional embeddings received.");

    // --------------------------------
    // START DATABASE TRANSACTION
    // --------------------------------

    transaction = await sequelize.transaction();

    // --------------------------------
    // Create User
    // --------------------------------

    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    const user = await User.create(
      {
        user_id: collegeId,
        password: hashedPassword,
        role: "student",
      },
      {
        transaction,
      }
    );

    console.log("✅ User created:", user.user_id);

    // --------------------------------
    // Create Student
    // --------------------------------

    const student = await Student.create(
      {
        user_id: collegeId,
        name,
        room_number: roomNumber,
        block_number: blockNumber,
        department,
        phone_number: phoneNumber,
        year: Number(year),
      },
      {
        transaction,
      }
    );

    console.log(
      "✅ Student created:",
      student.id
    );

    // --------------------------------
    // Create 5 face embeddings
    // --------------------------------

    const embeddingRecords = embeddings.map(
      (embedding, index) => ({
        student_id: student.id,
        sample_number: index + 1,
        embedding,
      })
    );

    await FaceEmbedding.bulkCreate(
      embeddingRecords,
      {
        transaction,
      }
    );

    console.log(
      "✅ 5 face embeddings stored."
    );

    // --------------------------------
    // COMMIT
    // --------------------------------

    await transaction.commit();

    transaction = null;

    console.log("=================================");
    console.log("🎉 REGISTRATION COMPLETED");
    console.log("=================================\n");

    return res.status(201).json({
      success: true,
      message: "Registration completed successfully.",
      student: {
        id: student.id,
        user_id: student.user_id,
        name: student.name,
      },
      embeddingsSaved: 5,
    });

  } catch (error) {

    console.error(
      "❌ REGISTRATION ERROR:",
      error
    );

    // --------------------------------
    // Rollback if transaction started
    // --------------------------------

    if (transaction) {
      try {
        await transaction.rollback();
      } catch (rollbackError) {
        console.error(
          "Rollback error:",
          rollbackError
        );
      }
    }

    return res.status(500).json({
      success: false,
      message: "Registration failed.",
      error: error.message,
    });
  }
};