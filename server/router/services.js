const express = require("express");
const dbconnect = require("../config/dbconnect");
const router = express.Router();
const serviceSQL = require("../sql/services");

router.get("/", (req, res) => {
  const { tendichvu, giadichvu } = req.query;

  dbconnect.query(
    serviceSQL.searchService(tendichvu, giadichvu),
    (err, result) => {
      if (err) throw err;
      res.send(result);
    }
  );
});

module.exports = router;
