const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");


const User = sequelize.define("User", {
  user_id: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM("student", "warden"),
    allowNull: false
  }
}, {
  tableName: "users",
  timestamps: false
});

module.exports = User;
