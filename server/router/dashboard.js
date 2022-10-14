const express = require("express");
const dbconnect = require("../config/dbconnect");
const router = express.Router();
const dashboardSQL = require("../sql/dashboard");

router.get("/", (req, res) => {
  const { name, phoneNumber, trangthaiID } = req.query;

  dbconnect.query(
    dashboardSQL.searchNV(name, phoneNumber, trangthaiID),
    (err, result) => {
      if (err) throw err;
      res.send(result);
    }
  );
});

router.post("/", (req, res) => {
  const { name, phoneNumber, trangthaiID } = req.body;

  dbconnect.query(
    dashboardSQL.insertNV,
    { name, phoneNumber, trangthaiID },
    (err, result) => {
      if (err) throw err;
      res.send(result);
    }
  );
});

router.put("/:id", (req, res) => {
  const { name, phoneNumber, trangthaiID } = req.body;
  dbconnect.query(
    dashboardSQL.updateNV(name, phoneNumber, trangthaiID, req.params.id),
    (err, result) => {
      if (err) throw err;
      res.send(result);
    }
  );
});

router.delete("/:id", (req, res) => {
  dbconnect.query(dashboardSQL.deleteNV(req.params.id), (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

module.exports = router;
