const express = require("express");
const dbconnect = require("../config/dbconnect");
const router = express.Router();
const customerSQL = require("../sql/customer");
const { checkToken } = require("../utils/checkToken");

router.get("/", checkToken, (req, res) => {
  try {
    const { name, phoneNumber } = req.query;

    dbconnect.query(
      customerSQL.searchCustomer(name, phoneNumber),
      (err, result) => {
        if (err) throw err;
        res.send({ error_code: 0, data: result, message: null });
      }
    );
  } catch (err) {
    res.json({ error_code: 404, message: "Not found" });
  }
});

router.post("/", checkToken, (req, res) => {
  try {
    const { name, phoneNumber } = req.body;

    dbconnect.query(
      customerSQL.insertCustomer,
      { name, phoneNumber },
      (err, result) => {
        if (!name || !phoneNumber) {
          res.send({ error_code: 404, message: "Invalid data" });
        } else {
          if (err) throw err;
          res.send({ error_code: 0, result: result, message: null });
        }
      }
    );
  } catch (err) {
    res.json({ error_code: 404, message: "Cannot add customer" });
  }
});

router.put("/:id", checkToken, (req, res) => {
  try {
    const { name, phoneNumber } = req.body;

    dbconnect.query(
      customerSQL.updateCustomer(name, phoneNumber, req.params.id),
      (err, result) => {
        if (!name || !phoneNumber) {
          res.send({ error_code: 404, message: "Invalid data" });
        } else {
          if (err) throw err;
          res.send({ error_code: 0, result: result, message: null });
        }
      }
    );
  } catch (err) {
    res.json({ error_code: 404, message: "Cannot update customer" });
  }
});

router.delete("/:id", checkToken, (req, res) => {
  try {
    dbconnect.query(
      customerSQL.deleteCustomer(req.params.id),
      (err, result) => {
        if (err) throw err;
        res.send({ error_code: 0, result: result, message: null });
      }
    );
  } catch (err) {
    res.json({ error_code: 404, message: "Cannot delete customer" });
  }
});

module.exports = router;
