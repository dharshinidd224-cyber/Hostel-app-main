const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");


const Attendance = sequelize.define(
  "Attendance",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.STRING(50),
      allowNull: false,
      references: {
        model: 'users',
        key: 'user_id'
      }
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    time_marked: {
      type: DataTypes.TIME,
      allowNull: true
    },
    ip_address: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('present', 'absent'),
      allowNull: false,
      defaultValue: 'absent'
    },
    auto_marked: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  },
  {
    tableName: "attendance",
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ['user_id', 'date']
      }
    ]
  }
);

module.exports = Attendance;