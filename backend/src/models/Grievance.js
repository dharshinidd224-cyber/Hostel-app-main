const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");


const Grievance = sequelize.define("Grievance", {
  grievance_id: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  user_id: {
    type: DataTypes.STRING,
    allowNull: false
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false
  },
  priority: {
    type: DataTypes.ENUM('low', 'medium', 'high', 'urgent'),
    defaultValue: 'medium'
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('pending', 'in-progress', 'resolved', 'rejected'),
    defaultValue: 'pending'
  },
  resolution_remarks: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  images: {
    type: DataTypes.JSON,
    allowNull: true
  }
}, {
  tableName: "grievances",
  timestamps: true,
  createdAt: "created_at",
  updatedAt: "updated_at"
});


module.exports = Grievance;