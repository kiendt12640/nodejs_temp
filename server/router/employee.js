const express = require("express");
const router = express.Router();
const employeeSQL = require("../sql/employee");
const { checkToken } = require("../utils/checkToken");
const jwt = require("jsonwebtoken");
const { isEmpty } = require("../utils/validate");
require("dotenv").config();
const { queryDB } = require("../utils/query");
const { Status } = require("../config/models/statusModel");
const { Employee } = require("../config/models/employeeModel");
const { Op } = require("sequelize");

router.get("/", checkToken, async (req, res) => {
  try {
    Status.hasMany(Employee);
    Employee.belongsTo(Status, {
      foreignKey: "trangthaiId",
    });
    const { name, phoneNumber, trangthaiID } = req.query;
    // const query = [];

    // // if (name || phoneNumber || trangthaiID) {
    // //   if (name) query.push({ name: name });
    // //   if (phoneNumber) query.push({ phoneNumber: phoneNumber });
    // //   if (trangthaiID) query.push({ trangthaiID: trangthaiID });

    // //   const employee = Employee.findAll({
    // //     where: {
    // //       [Op.and]: query,
    // //     },
    // //   });
    // //   res.send({ error_code: 0, data: employee, message: null });
    // // } else {
    const employee = await Employee.findAll({
      include: [
        {
          model: Status,
          required: true,
        },
      ],
    });

    res.send({ error_code: 0, data: employee, message: null });
    // }
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
    console.log({ name, phoneNumber, trangthaiID });
    if (!name || !phoneNumber || !trangthaiID) {
      res.json({ error_code: 404, message: "Invalid data" });
    }

    const employee = await Employee.create({
      name: name,
      phoneNumber: phoneNumber,
      trangthaiId: trangthaiId,
    });
    res.send({ error_code: 0, result: employee, message: null });
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
    const { name, phoneNumber, trangthaiID } = req.body;
    if (!name || !phoneNumber || !trangthaiID) {
      res.send({ error_code: 404, message: "Invalid data" });
    }

    const employee = await queryDB(
      employeeSQL.updateNV(name, phoneNumber, trangthaiID, req.params.id)
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
    const employee = await queryDB(employeeSQL.deleteNV(req.params.id));

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
