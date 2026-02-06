const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");


const Feedback = sequelize.define("Feedback", {
  user_id: {
    type: DataTypes.STRING,  // ✅ Changed from INTEGER to STRING (to match CS654213 format)
    allowNull: false
  },
  category: {               // ✅ ADD THIS - to store which category
    type: DataTypes.STRING,
    allowNull: false
  },
  rating: {                 // ✅ ADD THIS - to store the rating
    type: DataTypes.INTEGER,
    allowNull: false
  },
  comment: {                // ✅ ADD THIS - to store optional comment
    type: DataTypes.TEXT,
    allowNull: true
  },
  anonymous: {              // ✅ ADD THIS - to track if feedback is anonymous
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  status: {                 // ✅ ADD THIS - for tracking review status
    type: DataTypes.ENUM('pending', 'reviewed'),
    defaultValue: 'pending'
  }
}, {
  tableName: "feedback",
  timestamps: true,
  createdAt: "created_at",
  updatedAt: false
});

module.exports = Feedback;