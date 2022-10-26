const { DataTypes } = require("sequelize");
const sequelize = require("../dbconnect");

const StatusBill = sequelize.define(
  "trang_thai_don",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    trangthai: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
  },
  {
    tableName: "trang_thai_don",
    timestamps: false,
  }
);

// Bill.belongsTo(StatusBill, {
//   foreignKey: "trangthaidonID",
// });

module.exports = { StatusBill };
