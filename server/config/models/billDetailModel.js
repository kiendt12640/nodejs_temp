const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../dbconnect");

const BillDetail = sequelize.define("hoa_don_chi_tiet", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  dichvuID: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  soluong: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  hoadonID: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = BillDetail;
