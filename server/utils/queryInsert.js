const dbconnect = require("../config/dbconnect");

const queryDBInsert = (sql, value) =>
  new Promise((resolve, reject) => {
    try {
      dbconnect.query(sql, value, (error, result) => {
        if (error) reject(error);
        resolve(result);
      });
    } catch (error) {
      reject(error);
    }
  });

module.exports = { queryDBInsert };
