const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");


const Notice = sequelize.define(
  "Notice",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    notice_id: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM("notice", "alert"),
      allowNull: false,
      defaultValue: "notice",
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    priority: {
      type: DataTypes.ENUM("normal", "medium", "high"),
      defaultValue: "normal",
    },
    category: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    warden_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    warden_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    targets: {
      type: DataTypes.JSON, // Store array of targets
      defaultValue: [],
    },
    scheduled_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    scheduled_time: {
      type: DataTypes.TIME,
      allowNull: true,
    },
    attachments: {
      type: DataTypes.JSON, // Store array of attachment URLs
      defaultValue: [],
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: "notices",
    timestamps: true,
    createdAt: "created_at",   // ✅ Map to snake_case
    updatedAt: "updated_at"  
  }
);

module.exports = Notice;