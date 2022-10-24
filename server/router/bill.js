const express = require("express");
const dbconnect = require("../config/dbconnect");
const router = express.Router();
const billSQL = require("../sql/bill");
const { queryDB } = require("../utils/query");
const { checkToken } = require("../utils/checkToken");
const { response } = require("express");

router.get("/", checkToken, async (req, res) => {
  const { trangthaidonID, khachhangID, ngaythanhtoan, ngaynhanhang } =
    req.query;

  let data = [];
  try {
    const bill = await queryDB(
      billSQL.searchBill(
        trangthaidonID,
        khachhangID,
        ngaythanhtoan,
        ngaynhanhang
      )
    );

    for (const element of bill) {
      const billDetail = await queryDB(
        billSQL.searchBillDetail(element.hoa_don_id)
      );
      for (const ele of billDetail) {
        let price = ele.soluong * ele.giadichvu;
        if (typeof element.tongtien !== "undefined") {
          element.tongtien += price;
        } else {
          res.send({ error_code: 404, message: "tongtien is undefined" });
        }
      }
      data = [...data, { ...element, hdct: billDetail }];
    }

    res.send({ error_code: 0, data: data, message: null });
  } catch (err) {
    res.json({ error_code: 404, message: "Not found" });
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
      res.send({ error_code: 404, message: "Invalid data" });
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
    res.json({ error_code: 404, message: "Cannot add bill" });
  }
});

router.put("/:id", checkToken, (req, res) => {
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
      !ngaythanhtoan
    ) {
      res.send({ error_code: 404, message: "Invalid data" });
    }

    dbconnect.query(
      billSQL.updateBill(
        trangthaidonID,
        khachhangID,
        ngaythanhtoan,
        ngaynhanhang,
        ngaytrahang,
        req.params.id
      ),
      (err, result) => {
        if (err) throw err;
        res.send({ error_code: 0, result: result, message: null });
      }
    );
  } catch (err) {
    res.json({ error_code: 404, message: "Cannot update bill" });
  }
});

router.put("/delete_bill/:id", checkToken, (req, res) => {
  try {
    const { checkDelete } = req.body;

    if (!checkDelete) {
      res.send({ error_code: 404, message: "Invalid data" });
    }

    dbconnect.query(
      billSQL.updateCheckDelete(checkDelete, req.params.id),
      (err, result) => {
        if (err) throw err;
        res.send({ error_code: 0, result: result, message: null });
      }
    );
  } catch (err) {
    res.json({ error_code: 404, message: "Cannot delete bill" });
  }
});

module.exports = router;
