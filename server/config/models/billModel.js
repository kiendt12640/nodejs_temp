const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../dbconnect");

const Bill = sequelize.define("hoa_don", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  trangthaidonID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  khachhangID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  tongtien: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0,
  },
  ngaythanhtoan: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: null,
  },
  ngaynhanhang: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: null,
  },
  ngaytrahang: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: null,
  },
  xacNhanXoa: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  nhanvienID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: null,
  },
});

module.exports = Bill;
