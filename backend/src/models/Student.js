const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");


const Student = sequelize.define(
  "Student",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    room_number: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    block_number: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    department: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    phone_number: {
      type: DataTypes.STRING(15),
      allowNull: false
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  },
  {
    tableName: "students",
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  }
);
// At the bottom of the Student model file, before module.exports

module.exports = Student;