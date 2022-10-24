const express = require("express");
const statusSQL = require("../sql/status");
const { queryDB } = require("../utils/query");
const router = express.Router();

router.get("/", async (_, res) => {
  try {
    const status = await queryDB(statusSQL.searchStatus());

    res.send({ error_code: 0, data: status, message: null });
  } catch (err) {
    res.json({
      error_code: 500,
      message: "Something went wrong, try again later",
      error_debug: err,
    });
  }
});

module.exports = router;
