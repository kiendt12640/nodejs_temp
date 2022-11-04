const express = require("express");
const router = express.Router();
const { checkToken } = require("../utils/checkToken");
const jwt = require("jsonwebtoken");
const { isEmpty } = require("../utils/validate");
require("dotenv").config();
const { Status } = require("../config/models/statusModel");
const { Employee } = require("../config/models/employeeModel");

router.get("/", checkToken, async (req, res) => {
  try {
    const { name, phoneNumber, trangthaiId } = req.query;

    let employee;
    let condition = {};
    if (name) condition.name = name;
    if (phoneNumber) condition.phoneNumber = phoneNumber;
    if (trangthaiId) condition.trangthaiId = trangthaiId;
    employee = await Employee.findAll({
      include: [
        {
          model: Status,
          required: true,
        },
      ],
      where: condition
    });

    res.send({ error_code: 0, data: employee, message: null });
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
    const { name, phoneNumber, trangthaiId } = req.body;
    if (!name || !phoneNumber || !trangthaiId) {
     return res.json({ error_code: 404, message: "Invalid data" });
    }

    const employee = await Employee.create({
      name: name,
      phoneNumber: phoneNumber,
      trangthaiId: trangthaiId,
    });
  return  res.send({ error_code: 0, result: employee, message: null });
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
    const { name, phoneNumber, trangthaiId } = req.body;
    if (!name || !phoneNumber || !trangthaiId) {
      res.send({ error_code: 404, message: "Invalid data" });
    }

    const employee = await Employee.update(
      { name: name, phoneNumber: phoneNumber, trangthaiId: trangthaiId },
      {
        where: {
          id: req.params.id,
        },
      }
    );

    res.send({ error_code: 0, data: employee, message: null });
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
    const employee = await Employee.destroy({
      where: {
        id: req.params.id,
      },
    });

    res.send({ error_code: 0, data: employee, message: null });
  } catch (err) {
    res.json({
      error_code: 500,
      message: "Something went wrong, try again later",
      error_debug: err,
    });
  }
});

router.post("/sign-in", async (req, res) => {
  try {
    const { phoneNumber, password } = req.body;

    const employee = await Employee.findOne({
      where: {
        phoneNumber: `${phoneNumber}`,
      },
    });
    if (isEmpty(employee) || password != `${process.env.JWT_SECRET}`) {
      res.send({
        error_code: 404,
        message: "PhoneNumber or password is incorrect",
      });
    } else {
      const id = employee.id;
      const token = jwt.sign({ id }, `${process.env.JWT_SECRET}`, {
        expiresIn: `${process.env.JWT_EXPIRES_IN}`,
      });
      res.send({ token, error_code: 0 });
    }
  } catch (err) {
    res.json({
      error_code: 500,
      message: "Something went wrong, try again later",
      error_debug: err,
    });
  }
});

module.exports = router;
