const express = require("express");
const router = express.Router();
const { Status } = require("../config/models/statusModel");

router.get("/", async (_, res) => {
  try {
    const status = await Status.findAll();

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
