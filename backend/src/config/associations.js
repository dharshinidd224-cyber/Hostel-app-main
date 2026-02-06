const Student = require("../models/Student");
const Feedback = require("../models/Feedback");
const Grievance = require("../models/Grievance");
const Notice = require("../models/Notice");

// Feedback associations
Feedback.belongsTo(Student, {
  foreignKey: 'user_id',
  targetKey: 'user_id',
  as: 'student'
});

Student.hasMany(Feedback, {
  foreignKey: 'user_id',
  sourceKey: 'user_id',
  as: 'feedbacks'
});

// Grievance associations ✅ ADD THIS
Grievance.belongsTo(Student, {
  foreignKey: 'user_id',
  targetKey: 'user_id',
  as: 'student'
});

Student.hasMany(Grievance, {
  foreignKey: 'user_id',
  sourceKey: 'user_id',
  as: 'grievances'
});

console.log("✅ Model associations loaded");

module.exports = { Student, Feedback, Grievance };