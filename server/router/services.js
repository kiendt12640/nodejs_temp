const express = require("express");
const router = express.Router();
const serviceSQL = require("../sql/services");
const { queryDB } = require("../utils/query");
const { checkToken } = require("../utils/checkToken");

router.get("/", checkToken, async (req, res) => {
  try {
    const { tendichvu, giadichvu } = req.query;

    const service = await queryDB(
      serviceSQL.searchService(tendichvu, giadichvu)
    );

    res.send({ error_code: 0, data: service, message: null });
  } catch (err) {
    res.json({
      error_code: 500,
      message: "Something went wrong, try again later",
      error_debug: err,
    });
  }
});

module.exports = router;
