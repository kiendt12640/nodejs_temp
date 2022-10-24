const express = require("express");
const dbconnect = require("../config/dbconnect");
const router = express.Router();
const billSQL = require("../sql/bill");
const { queryDB } = require("../utils/query");
const { checkToken } = require("../utils/checkToken");

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
        element.tongtien += price; // nếu tổng tiền đang undefined sẽ lỗi ? lỗi này chưa sửa
      }
      data = [...data, { ...element, hdct: billDetail }];
    }

    res.send({ error_code: 0, data: data, message: null });
  } catch (err) {
    res.json({ error: err }); // error code, message chưa có
  }
});

router.post("/", checkToken, async (req, res) => {
  const {
    ngaynhanhang,
    ngaytrahang,
    trangthaidonID,
    khachhangID,
    listBillDetail,
  } = req.body;

  // Kiểm tra dữ liệu nhập vào thì phải kiểm tra trước khi insert

  dbconnect.query(
    billSQL.insertBill,
    {
      trangthaidonID,
      khachhangID,
      ngaynhanhang,
      ngaytrahang,
      nhanvienID: req.id,
    },
    async (err, result) => {
      if (!ngaynhanhang || !ngaytrahang || !khachhangID || !listBillDetail) {
        res.send({ error_code: 498, message: "Invalid data" });
      } else {
        if (err) throw err;
        for (let i = 0; i < listBillDetail.length; i++) {
          dbconnect.query(billSQL.insertBillDetail, {
            dichvuID: listBillDetail[i].dichvuID,
            soluong: listBillDetail[i].soluong,
            hoadonID: result.insertId,
          });
        }
        res.send(result); // error code, message chưa có
      }
    }
  );
});

// tương tự
router.put("/:id", checkToken, (req, res) => {
  //  không có try catch
  const {
    trangthaidonID,
    khachhangID,
    ngaynhanhang,
    ngaythanhtoan,
    ngaytrahang,
    checkDelete,
  } = req.body;

  // Kiểm tra dữ liệu nhập vào thì phải kiểm tra trước khi update

  dbconnect.query(
    billSQL.updateBill(
      trangthaidonID,
      khachhangID,
      ngaythanhtoan,
      ngaynhanhang,
      ngaytrahang,
      checkDelete,
      req.params.id
    ),
    (err, result) => {
      if (!trangthaidonID || !khachhangID || !ngaynhanhang || !ngaytrahang) {
        // 498 ? 498 là token expire
        res.send({ error_code: 498, message: "Invalid data" });
      } else {
        if (err) throw err;
        res.send(result); // error code, message chưa có
      }
    }
  );
});

// xóa hóa đơn ? hóa đơn không được xóa chỉ được gắn cờ xóa
router.delete("/:id", checkToken, (req, res) => {
  //  không có try catch
  dbconnect.query(billSQL.deleteBill(req.params.id), (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

module.exports = router;
