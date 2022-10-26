const express = require("express");
const router = express.Router();
const customerSQL = require("../sql/customer");
const { checkToken } = require("../utils/checkToken");
const { queryDB } = require("../utils/query");
const { queryDBInsert } = require("../utils/queryInsert");
const { Customer } = require("../config/models/customerModel");

router.get("/", checkToken, async (req, res) => {
  try {
    const { name, phoneNumber } = req.query;

    const customer = await Customer.findAll();

    res.send({ error_code: 0, data: customer, message: null });
  } catch (err) {
    res.json({
      error_code: 500,
      message: "Something went wrong, try again later",
      error_debug: err,
    });
  }
});

router.post("/", checkToken, async (req, res) => {
  try {
    const { name, phoneNumber } = req.body;
    if (!name || !phoneNumber) {
      res.json({ error_code: 404, message: "Invalid data" });
    }

    const customer = await queryDBInsert(customerSQL.insertCustomer, {
      name,
      phoneNumber,
    });
    res.send({ error_code: 0, result: customer, message: null });
  } catch (err) {
    res.json({
      error_code: 500,
      message: "Something went wrong, try again later",
      error_debug: err,
    });
  }
});

router.put("/:id", checkToken, async (req, res) => {
  try {
    const { name, phoneNumber } = req.body;
    if (!name || !phoneNumber || !req.params.id) {
      res.send({ error_code: 404, message: "Invalid data" });
    }

    const customer = await queryDB(
      customerSQL.updateCustomer(name, phoneNumber, req.params.id)
    );

    res.send({ error_code: 0, data: customer, message: null });
  } catch (err) {
    res.json({
      error_code: 500,
      message: "Something went wrong, try again later",
      error_debug: err,
    });
  }
});

router.delete("/:id", checkToken, async (req, res) => {
  try {
    const customer = await queryDB(customerSQL.deleteCustomer(req.params.id));

    res.send({ error_code: 0, data: customer, message: null });
  } catch (err) {
    res.json({
      error_code: 500,
      message: "Something went wrong, try again later",
      error_debug: err,
    });
  }
});

module.exports = router;
