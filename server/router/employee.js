const express = require("express");
const dbconnect = require("../config/dbconnect");
const router = express.Router();
const employeeSQL = require("../sql/employee");
const { checkToken } = require("../utils/checkToken");
const jwt = require("jsonwebtoken");
const signinSQL = require("../sql/signin");
const { isEmpty } = require("../utils/validate");
require("dotenv").config();

router.get("/", checkToken, (req, res) => {
  const { name, phoneNumber, trangthaiID } = req.query;

  dbconnect.query(
    employeeSQL.searchNV(name, phoneNumber, trangthaiID),
    (err, result) => {
      if (err) throw err;
      res.send({ error_code: 0, data: result, message: null });
    }
  );
});

router.post("/", checkToken, (req, res) => {
  const { name, phoneNumber, trangthaiID } = req.body;

  dbconnect.query(
    employeeSQL.insertNV,
    { name, phoneNumber, trangthaiID },
    (err, result) => {
      if (!name || !phoneNumber || !trangthaiID) {
        res.send({ error_code: 498, message: "Invalid data" });
      } else {
        if (err) throw err;
        res.send(result);
      }
    }
  );
});

router.put("/:id", checkToken, (req, res) => {
  const { name, phoneNumber, trangthaiID } = req.body;

  dbconnect.query(
    employeeSQL.updateNV(name, phoneNumber, trangthaiID, req.params.id),
    (err, result) => {
      if (!name || !phoneNumber || !trangthaiID) {
        res.send({ error_code: 498, message: "Invalid data" });
      } else {
        if (err) throw err;
        res.send(result);
      }
    }
  );
});

router.delete("/:id", checkToken, (req, res) => {
  dbconnect.query(employeeSQL.deleteNV(req.params.id), (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

router.post("/sign-in", (req, res) => {
  try {
    const { phoneNumber, password } = req.body;

    dbconnect.query(signinSQL.searchAcc(phoneNumber), (_, result) => {
      if (isEmpty(result) || password != `${process.env.JWT_SECRET}`) {
        res.send({
          error_code: 401,
          message: "PhoneNumber or password is incorrect",
        });
      } else {
        const id = result[0].id;
        const token = jwt.sign({ id }, `${process.env.JWT_SECRET}`, {
          expiresIn: `${process.env.JWT_EXPIRES_IN}`,
        });
        res.send({ token, error_code: 0 });
      }
    });
  } catch (err) {
    res.json({ error: err });
  }
});

module.exports = router;
