const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../dbconnect");

const Status = sequelize.define(
  "trangthai",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    trangthai: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "trangthai",
    timestamps: false,
  }
);

module.exports = { Status };
