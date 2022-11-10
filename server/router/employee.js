const router = require('./setUpRouter').Router();
const jwt = require("jsonwebtoken");
const { isEmpty } = require("../utils/validate");
require("dotenv").config();
const { Status } = require("../config/models/statusModel");
const { Employee } = require("../config/models/employeeModel");

const getListEmployee = async (req, res) => {
  try {
    const { name, phoneNumber, trangthaiId } = req.query;

    let employee;
    let condition = {};
    if (!isEmpty(name)) condition.name = name;
    if (!isEmpty(phoneNumber)) condition.phoneNumber = phoneNumber;
    if (!isEmpty(trangthaiId)) condition.trangthaiId = trangthaiId;
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
};

const addEmployee = async (req, res) => {
  try {
    const { name, phoneNumber, trangthaiId } = req.body;
    if (isEmpty(name) || isEmpty(phoneNumber) || isEmpty(trangthaiId)) {
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
};

const updateEmployee = async (req, res) => {
  try {
    const { name, phoneNumber, trangthaiId } = req.body;
    if (isEmpty(name) || isEmpty(phoneNumber) || isEmpty(trangthaiId)) {
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
};

const deleteEmployee = async (req, res) => {
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
};

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

router.getRoute('/', getListEmployee, true)
router.postRoute('/', addEmployee, true)
router.putRoute('/:id', updateEmployee, true)
router.deleteRoute('/:id', deleteEmployee, true)

module.exports = router;
