const express = require("express");
const dbconnect = require("../config/dbconnect");
const router = express.Router();
const employeeSQL = require("../sql/employee");
const { checkToken } = require("../utils/checkToken");
const jwt = require("jsonwebtoken");
const signinSQL = require("../sql/signin");
const { isEmpty } = require("../utils/validate");
require("dotenv").config();
const { queryDB } = require("../utils/query");
const { queryDBInsert } = require("../utils/queryInsert");
const { Employee } = require("../config/models/employeeModel");

router.get("/", checkToken, async (req, res) => {
  try {
    const { name, phoneNumber, trangthaiID } = req.query;

    const employee = await queryDB(
      employeeSQL.searchNV(name, phoneNumber, trangthaiID)
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

router.post("/", checkToken, async (req, res) => {
  try {
    const { name, phoneNumber, trangthaiID } = req.body;
    if (!name || !phoneNumber || !trangthaiID) {
      res.json({ error_code: 404, message: "Invalid data" });
    }

    const employee = await queryDBInsert(employeeSQL.insertNV, {
      name,
      phoneNumber,
      trangthaiID,
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

    const employee = await Employee.findAll({
      where: {
        phoneNumber: phoneNumber,
      },
    });
    if (!employee || password != `${process.env.JWT_SECRET}`) {
      res.send({
        error_code: 404,
        message: "PhoneNumber or password is incorrect",
      });
    } else {
      const id = employee[0].id;
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

  //   (_, result) => {
  //     if (isEmpty(result) || password != `${process.env.JWT_SECRET}`) {
  //       res.send({
  //         error_code: 404,
  //         message: "PhoneNumber or password is incorrect",
  //       });
  //     } else {
  //       const id = result[0].id;
  //       const token = jwt.sign({ id }, `${process.env.JWT_SECRET}`, {
  //         expiresIn: `${process.env.JWT_EXPIRES_IN}`,
  //       });
  //       res.send({ token, error_code: 0 });
  //     }
  //   });
  // } catch (err) {
  //   res.json({
  //     error_code: 500,
  //     message: "Something went wrong, try again later",
  //     error_debug: err,
  //   });
  // }
});

module.exports = router;
