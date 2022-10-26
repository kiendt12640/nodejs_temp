const express = require("express");
const router = express.Router();
const { StatusBill } = require("../config/models/statusBillModel");

router.get("/", async (_, res) => {
  try {
    const statusBill = await StatusBill.findAll();

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
