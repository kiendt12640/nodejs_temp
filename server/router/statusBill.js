const express = require("express");
const dbconnect = require("../config/dbconnect");
const statusBillSQL = require("../sql/statusBill");
const router = express.Router();

router.get("/", (_, res) => {
  dbconnect.query(statusBillSQL.searchStatusBill(), (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

module.exports = router;
