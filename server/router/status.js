const express = require("express");
const dbconnect = require("../config/dbconnect");
const statusSQL = require("../sql/status");
const router = express.Router();

router.get("/", (_, res) => {
  dbconnect.query(statusSQL.searchStatus(), (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

module.exports = router;
