const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../dbconnect");

const Employee = sequelize.define(
  "nv",
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
    trangthaiID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = { Employee };
