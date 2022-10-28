const { DataTypes } = require("sequelize");
const sequelize = require("../dbconnect");

const Service = sequelize.define(
  "dich_vu",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    tendichvu: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    giadichvu: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
    },
  },
  {
    tableName: "dich_vu",
    timestamps: false,
  }
);

module.exports = { Service };
