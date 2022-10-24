const express = require("express");
const dbconnect = require("../config/dbconnect");
const statusBillSQL = require("../sql/statusBill");
const router = express.Router();

router.get("/", (_, res) => {
  try {
    dbconnect.query(statusBillSQL.searchStatusBill(), (err, result) => {
      if (err) throw err;
      res.send({ error_code: 0, data: result, message: null });
    });
  } catch (err) {
    res.json({ error_code: 404, message: "Not found" });
  }
});

module.exports = router;
