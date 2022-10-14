const express = require("express");
const dbconnect = require("../config/dbconnect");
const router = express.Router();
const dashboardSQL = require("../sql/dashboard");

const checkToken = (req, res, next) => {
  console.log(req.headers.authorization.split("Bearer ")[1]);
  console.log(12312321312);
  const decode = { id: 1 };

  req.id = decode.id;

  const checkTokenValid = true;
  try {
    if (checkTokenValid) {
      next();
    } else {
      res.json({ error_code: 498, error_msg: "Token invalid" });
    }
  } catch (error) {
    res.json({ error_code: 498, error_msg: "Token invalid" });
  }
};

router.get("/", checkToken, (req, res) => {
  console.log(req.id);
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
