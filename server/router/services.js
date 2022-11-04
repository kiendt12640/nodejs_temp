const express = require("express");
const router = express.Router();
const { checkToken } = require("../utils/checkToken");
const { Service } = require("../config/models/serviceModel");

router.get("/", checkToken, async (req, res) => {
  try {
    const { tendichvu, giadichvu } = req.query;

    let service;
    let condition = {}
    if (tendichvu) condition.tendichvu = tendichvu;
    if (giadichvu) condition.giadichvu = giadichvu;

    service = await Service.findAll({
      where: condition
    });

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
