const express = require("express");
const dbconnect = require("../config/dbconnect");
const router = express.Router();
const billSQL = require("../sql/bill");
const { queryDB } = require("../utils/query");
const { checkToken } = require("../utils/checkToken");
const { queryDBInsert } = require("../utils/queryInsert");

router.get("/list", checkToken, async (req, res) => {
  const { trangthaidonID, khachhangID } = req.query;

  let data = [];
  try {
    const bill = await queryDB(billSQL.searchBill(trangthaidonID, khachhangID));

    for (const element of bill) {
      element.tongtien = 0;
      const billDetail = await queryDB(
        billSQL.searchBillDetail(element.hoa_don_id)
      );
      for (const ele of billDetail) {
        let price = ele.soluong * ele.giadichvu;
        element.tongtien += price;
      }
      data = [...data, { ...element, hdct: billDetail }];
    }

    res.send({ error_code: 0, data: data, message: null });
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

    // đổi sang thành dạng promise

    // new Promise((resolve, reject) => {
    //   try {
    //     dbconnect.query(
    //       billSQL.insertBill,
    //       {
    //         trangthaidonID,
    //         khachhangID,
    //         ngaynhanhang,
    //         ngaytrahang,
    //         nhanvienID: req.id,
    //       },
    //       (error, result) => {
    //         if (error) reject(error);
    //         for (let i = 0; i < listBillDetail.length; i++) {
    //           dbconnect.query(billSQL.insertBillDetail, {
    //             dichvuID: listBillDetail[i].dichvuID,
    //             soluong: listBillDetail[i].soluong,
    //             hoadonID: result.insertId,
    //           });
    //         }
    //         resolve(result);
    //       }
    //     );
    //   } catch (error) {
    //     reject(error);
    //   }
    // });

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
