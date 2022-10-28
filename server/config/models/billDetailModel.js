const { DataTypes } = require("sequelize");
const sequelize = require("../dbconnect");
const { Service } = require("./serviceModel");
const BillDetail = sequelize.define(
  "hoa_don_chi_tiet",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    dichvuId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    soluong: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    hoadonId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "hoa_don_chi_tiet",
    timestamps: false,
  }
);

BillDetail.belongsTo(Service, {
  foreignKey: "dichvuId",
  as: "dich_vu",
});

module.exports = { BillDetail };
