const mysql = require("mysql");
require("dotenv").config();

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "to_do",
});

db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log("Mysql connecting...");
});

module.exports = db;
