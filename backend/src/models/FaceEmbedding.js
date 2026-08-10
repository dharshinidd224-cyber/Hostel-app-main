const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const FaceEmbedding = sequelize.define(
  "FaceEmbedding",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    student_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    sample_number: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    embedding: {
      type: DataTypes.JSON,
      allowNull: false,
    },

    created_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "face_embeddings",
    timestamps: false,
  }
);

module.exports = FaceEmbedding;