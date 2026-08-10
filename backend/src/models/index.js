const { sequelize } = require('../config/db');


// Import models
const User = require('./User');
const Student = require('./Student');
const Grievance = require('./Grievance');
const Notice = require('./Notice');
const Feedback = require('./Feedback');
const Attendance = require('./attendance.model');
const FaceEmbedding = require('./FaceEmbedding');

// Remove any associate functions
delete User.associate;
delete Student.associate;
delete Grievance.associate;
delete Feedback.associate;
delete Attendance.associate;

// Set up associations

// User <-> Student
User.hasOne(Student, {
  foreignKey: 'user_id',
  sourceKey: 'user_id',
  as: 'studentProfile'
});

Student.belongsTo(User, {
  foreignKey: 'user_id',
  targetKey: 'user_id',
  as: 'user'
});

// Grievance <-> Student
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

// Feedback <-> Student
Feedback.belongsTo(Student, {
  foreignKey: 'user_id',
  targetKey: 'user_id',
  as: 'student'
});

Student.hasMany(Feedback, {
  foreignKey: 'user_id',
  sourceKey: 'user_id',
  as: 'feedback'
});
// Attendance <-> Student
Attendance.belongsTo(Student, {
  foreignKey: 'user_id',
  targetKey: 'user_id',
  as: 'student'
});

Student.hasMany(Attendance, {
  foreignKey: 'user_id',
  sourceKey: 'user_id',
  as: 'attendance'
});

Student.hasMany(FaceEmbedding, {
  foreignKey: 'student_id',
  sourceKey: 'id',
  as: 'faceEmbeddings'
});

FaceEmbedding.belongsTo(Student, {
  foreignKey: 'student_id',
  targetKey: 'id',
  as: 'student'
});

module.exports = {
  sequelize,
  User,
  Student,
  Grievance,
  Notice,
  Feedback,
  Attendance,
  FaceEmbedding
};