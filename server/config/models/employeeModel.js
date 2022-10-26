const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../dbconnect");
const { Status } = require("./statusModel");

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
  },
  {
    timestamps: true,
    tableName: "nv",
  }
);

// Employee.hasMany(Bill);
// Bill.belongsTo(Employee, {
//   foreignKey: "nhanvienID",
// });

module.exports = { Employee };
