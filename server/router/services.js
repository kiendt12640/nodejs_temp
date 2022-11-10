const router = require('./setUpRouter').Router();
const { Service } = require("../config/models/serviceModel");
const { isEmpty } = require("../utils/validate")

const getListService = async (req, res) => {
  try {
    const { tendichvu, giadichvu } = req.query;

    let service;
    let condition = {}
    if (!isEmpty(tendichvu)) condition.tendichvu = tendichvu;
    if (!isEmpty(giadichvu)) condition.giadichvu = giadichvu;

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
};

router.getRoute('/', getListService, true)

module.exports = router;
