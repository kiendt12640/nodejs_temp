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
  const { trangthaidonId, khachhangId } = req.query;
  try {
    let bill;
    if (trangthaidonId) {
      bill = await Bill.findAll({
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
        where: {
          trangthaidonId: trangthaidonId,
        },
      });
    } else if (khachhangId) {
      bill = await Bill.findAll({
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
        where: {
          khachhangId: khachhangId,
        },
      });
    } else {
      bill = await Bill.findAll({
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
    }

    const newData = bill.reduce((a, c) => {
      const tong_tien =
        c?.dataValues?.hoa_don_chi_tiet?.reduce((a, c) => {
          if (c?.soluong && c?.dich_vu?.giadichvu)
            return (a += c.soluong * c.dich_vu.giadichvu);
          return a;
        }, 0) || 0;
      return [...a, { ...c.dataValues, tong_tien }];
    }, []);

    res.send({ error_code: 0, data: newData, message: null });
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
      trangthaidonId,
      khachhangId,
      listBillDetail,
    } = req.body;

    if (!ngaynhanhang || !ngaytrahang || !khachhangId || !listBillDetail) {
      res.json({ error_code: 404, message: "Invalid data" });
    }

    await Bill.create({
      trangthaidonId: trangthaidonId,
      khachhangId: khachhangId,
      ngaynhanhang: ngaynhanhang,
      ngaytrahang: ngaytrahang,
      nhanvienId: req.id,
    })
      .then((result) => {
        for (let i = 0; i < listBillDetail.length; i++) {
          BillDetail.create({
            dichvuId: listBillDetail[i].dichvuId,
            soluong: listBillDetail[i].soluong,
            hoadonId: result.id,
          });
        }
        res.send({ error_code: 0, result: result, message: null });
      })
      .catch((err) => {
        res.json({
          error_code: 500,
          message: "Something went wrong, try again later",
          error_debug: err,
        });
      });
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
      trangthaidonId,
      khachhangId,
      ngaynhanhang,
      ngaythanhtoan,
      ngaytrahang,
    } = req.body;

    if (
      !ngaynhanhang ||
      !ngaytrahang ||
      !khachhangId ||
      !trangthaidonId ||
      !ngaythanhtoan ||
      !req.params.id
    ) {
      res.send({ error_code: 404, message: "Invalid data" });
    }

    const bill = await Bill.update(
      {
        trangthaidonId: trangthaidonId,
        khachhangId: khachhangId,
        ngaynhanhang: ngaynhanhang,
        ngaythanhtoan: ngaythanhtoan,
        ngaytrahang: ngaytrahang,
      },
      {
        where: {
          id: req.params.id,
        },
      }
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
    const bill = await Bill.update(
      {
        xacNhanXoa: 1,
      },
      {
        where: {
          id: req.params.id,
        },
      }
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

module.exports = router;
