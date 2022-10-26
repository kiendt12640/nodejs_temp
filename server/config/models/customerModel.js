const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../dbconnect");
const Customer = sequelize.define(
  "khach_hang",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "",
    },
    phoneNumber: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: null,
    },
  },
  {
    timestamps: true,
    tableName: "khach_hang",
  }
);

module.exports = { Customer };
