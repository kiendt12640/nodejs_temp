// const mysql = require("mysql");
require("dotenv").config();

const { Sequelize, DataTypes } = require("sequelize");
const sequelize = new Sequelize(
  `${process.env.DATABASE}`,
  `${process.env.USER}`,
  `${process.env.PASSWORD}`,
  {
    host: `${process.env.HOST}`,
    dialect: "mysql",
  }
);

sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((error) => {
    console.error("Unable to connect to the database: ", error);
  });

module.exports = sequelize;

// const db = mysql.createConnection({
//   host: `${process.env.HOST}`,
//   user: `${process.env.USER}`,
//   password: `${process.env.PASSWORD}`,
//   database: `${process.env.DATABASE}`,
// });

// db.connect((err) => {
//   if (err) {
//     throw err;
//   }
//   console.log("Mysql connecting...");
// });
