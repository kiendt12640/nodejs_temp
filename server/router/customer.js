const express = require("express");
const router = express.Router();
const { checkToken } = require("../utils/checkToken");
const { isEmpty } = require("../utils/validate")
const { Customer } = require("../config/models/customerModel");

router.get("/", checkToken, async (req, res) => {
  try {
    const { name, phoneNumber } = req.query;

    let customer;
    let condition = {}
    if (!isEmpty(name)) condition.name = name;
    if (!isEmpty(phoneNumber)) condition.phoneNumber = phoneNumber;
    customer = await Customer.findAll({
      where: condition
    });

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
    if (isEmpty(name) || isEmpty(phoneNumber)) {
      res.json({ error_code: 404, message: "Invalid data" });
    }

    const customer = await Customer.create({
      name: name,
      phoneNumber: phoneNumber,
    });
  return  res.send({ error_code: 0, result: customer, message: null });
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
    if (isEmpty(name) || isEmpty(phoneNumber) || isEmpty(req.params.id)) {
      res.send({ error_code: 404, message: "Invalid data" });
    }

    const customer = await Customer.update(
      { name: name, phoneNumber: phoneNumber },
      {
        where: {
          id: req.params.id,
        },
      }
    );

  return  res.send({ error_code: 0, data: customer, message: null });
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
    const customer = await Customer.destroy({
      where: {
        id: req.params.id,
      },
    });

   return res.send({ error_code: 0, data: customer, message: null });
  } catch (err) {
    res.json({
      error_code: 500,
      message: "Something went wrong, try again later",
      error_debug: err,
    });
  }
});

module.exports = router;
