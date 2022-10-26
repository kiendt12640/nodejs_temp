const { DataTypes } = require("sequelize");
const sequelize = require("../dbconnect");
const { BillDetail } = require("./billDetailModel");
const { Customer } = require("./customerModel");
const { Employee } = require("./employeeModel");
const { StatusBill } = require("./statusBillModel");

const Bill = sequelize.define(
  "hoa_don",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    trangthaidonId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    khachhangId: {
      type: DataTypes.INTEGER,
      allowNull: false,
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
    nhanvienId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: null,
    },
  },
  {
    tableName: "hoa_don",
    timestamps: false,
  }
);

Bill.belongsTo(Employee, {
  foreignKey: "nhanvienId",
  as: "nhan_vien",
});

Bill.belongsTo(StatusBill, {
  foreignKey: "trangthaidonId",
  as: "trang_thai_don",
});

Bill.belongsTo(Customer, {
  foreignKey: "khachhangId",
  as: "khach_hang",
});

Bill.hasMany(BillDetail, {
  foreignKey: "hoadonId",
  as: "hoa_don_chi_tiet",
});

module.exports = { Bill };
