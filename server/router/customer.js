const express = require("express");
const dbconnect = require("../config/dbconnect");
const router = express.Router();
const customerSQL = require("../sql/customer");

router.get("/", (req, res) => {
  const { name, phoneNumber } = req.query;

  dbconnect.query(
    customerSQL.searchCustomer(name, phoneNumber),
    (err, result) => {
      if (err) throw err;
      res.send(result);
    }
  );
});

router.post("/", (req, res) => {
  const { name, phoneNumber } = req.body;

  dbconnect.query(
    customerSQL.insertCustomer,
    { name, phoneNumber },
    (err, result) => {
      if (err) throw err;
      res.send(result);
    }
  );
});

router.put("/:id", (req, res) => {
  const { name, phoneNumber } = req.body;
  dbconnect.query(
    customerSQL.updateCustomer(name, phoneNumber, req.params.id),
    (err, result) => {
      if (err) throw err;
      res.send(result);
    }
  );
});

router.delete("/:id", (req, res) => {
  dbconnect.query(customerSQL.deleteCustomer(req.params.id), (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

module.exports = router;
