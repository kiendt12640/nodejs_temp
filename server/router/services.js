const express = require("express");
const dbconnect = require("../config/dbconnect");
const router = express.Router();
const serviceSQL = require("../sql/services");
const { checkToken } = require("../utils/checkToken");

router.get("/", checkToken, (req, res) => {
  try {
    const { tendichvu, giadichvu } = req.query;

    dbconnect.query(
      serviceSQL.searchService(tendichvu, giadichvu),
      (err, result) => {
        if (err) throw err;
        res.send({ error_code: 0, data: result, message: null });
      }
    );
  } catch (err) {
    res.json({ error_code: 404, message: "Not found" });
  }
});

module.exports = router;
