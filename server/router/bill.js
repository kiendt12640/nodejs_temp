const express = require("express");
const dbconnect = require("../config/dbconnect");
const router = express.Router();
const billSQL = require("../sql/bill");
const { queryDB } = require("../utils/query");
const { checkToken } = require("../utils/checkToken");
const { queryDBInsert } = require("../utils/queryInsert");
const { Bill } = require("../config/models/billModel");
const { Customer } = require("../config/models/customerModel");
const { Employee } = require("../config/models/employeeModel");
const { StatusBill } = require("../config/models/statusBillModel");
const { BillDetail } = require("../config/models/billDetailModel");
const { Sequelize } = require("sequelize");
const { Service } = require("../config/models/serviceModel");

router.get("/list", checkToken, async (req, res) => {
  // const { trangthaidonID, khachhangID } = req.query;
  try {
    let bill = await Bill.findAll({
      include: [
        { model: Customer, as: "khach_hang" },
        { model: StatusBill, as: "trang_thai_don" },
        { model: Employee, as: "nhan_vien" },
        {
          model: BillDetail,
          as: "hoa_don_chi_tiet",
          include: [{ model: Service, as: "dich_vu" }],
        },
      ],
    });

    const newData = bill.reduce((a, c) => {
      const tong_tien =
        c?.dataValues?.hoa_don_chi_tiet?.reduce((a, c) => {
          if (c?.soluong && c?.dich_vu?.giadichvu)
            return (a += c.soluong * c.dich_vu.giadichvu);
          return a;
        }, 0) || 0;
      return [...a, { ...c.dataValues, tong_tien }];
    }, []);

    res.json({ error_code: 0, data: newData, message: null });
  } catch (err) {
    res.json({
      error_code: 500,
      message: "Something went wrong, try again later",
      error_debug: err,
    });
  }
});

router.post("/", checkToken, async (req, res) => {
  try {
    const {
      ngaynhanhang,
      ngaytrahang,
      trangthaidonID,
      khachhangID,
      listBillDetail,
    } = req.body;

    if (!ngaynhanhang || !ngaytrahang || !khachhangID || !listBillDetail) {
      res.json({ error_code: 404, message: "Invalid data" });
    }

    dbconnect.query(
      billSQL.insertBill,
      {
        trangthaidonID,
        khachhangID,
        ngaynhanhang,
        ngaytrahang,
        nhanvienID: req.id,
      },
      (err, result) => {
        if (err) throw err;
        for (let i = 0; i < listBillDetail.length; i++) {
          dbconnect.query(billSQL.insertBillDetail, {
            dichvuID: listBillDetail[i].dichvuID,
            soluong: listBillDetail[i].soluong,
            hoadonID: result.insertId,
          });
        }
        res.send({ error_code: 0, result: result, message: null });
      }
    );
  } catch (err) {
    res.json({
      error_code: 500,
      message: "Something went wrong, try again later",
      error_debug: err,
    });
  }
});

router.put("/:id", checkToken, async (req, res) => {
  try {
    const {
      trangthaidonID,
      khachhangID,
      ngaynhanhang,
      ngaythanhtoan,
      ngaytrahang,
    } = req.body;

    if (
      !ngaynhanhang ||
      !ngaytrahang ||
      !khachhangID ||
      !trangthaidonID ||
      !ngaythanhtoan ||
      !req.params.id
    ) {
      res.send({ error_code: 404, message: "Invalid data" });
    }

    const bill = await queryDB(
      billSQL.updateBill(
        trangthaidonID,
        khachhangID,
        ngaynhanhang,
        ngaythanhtoan,
        ngaytrahang,
        req.params.id
      )
    );

    res.send({ error_code: 0, data: bill, message: null });
  } catch (err) {
    res.json({
      error_code: 500,
      message: "Something went wrong, try again later",
      error_debug: err,
    });
  }
});

router.put("/delete_bill/:id", checkToken, async (req, res) => {
  try {
    const bill = await queryDB(billSQL.deleteBill(req.params.id));

    res.send({ error_code: 0, data: bill, message: null });
  } catch (err) {
    res.json({
      error_code: 500,
      message: "Something went wrong, try again later",
      error_debug: err,
    });
  }
});

module.exports = router;
