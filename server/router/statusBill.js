const express = require("express");
const statusBillSQL = require("../sql/statusBill");
const { queryDB } = require("../utils/query");
const router = express.Router();

router.get("/", async (_, res) => {
  try {
    const statusBill = await queryDB(statusBillSQL.searchStatusBill());

    res.send({ error_code: 0, data: statusBill, message: null });
  } catch (err) {
    res.json({
      error_code: 500,
      message: "Something went wrong, try again later",
      error_debug: err,
    });
  }
});

module.exports = router;
