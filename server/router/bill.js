const express = require("express");
const dbconnect = require("../config/dbconnect");
const router = express.Router();
const billSQL = require("../sql/bill");

const query = (sql) =>
  new Promise((resolve, reject) => {
    dbconnect.query(sql, (error, result) => {
      if (error) reject(error);
      resolve(result);
    });
  });

router.get("/", async (req, res) => {
  const { trangthaidonID, khachhangID, ngaythanhtoan, ngaynhanhang } =
    req.query;

  let data = [];

  const bill = await query(
    billSQL.searchBill(trangthaidonID, khachhangID, ngaythanhtoan, ngaynhanhang)
  );

  for (const element of bill) {
    const billDetail = await query(
      billSQL.searchBillDetail(element.hoa_don_id)
    );
    for (const ele of billDetail) {
      let price = ele.soluong * ele.giadichvu;
      element.tongtien += price;
    }
    data = [...data, { ...element, hdct: billDetail }];
  }

  res.send(data);

  // const bill = await dbconnect.query(
  //   billSQL.searchBill(trangthaidonID, khachhangID, ngaythanhtoan, ngaynhanhang)
  // );

  // dbconnect.query(
  //   billSQL.searchBill(
  //     trangthaidonID,
  //     khachhangID,
  //     ngaythanhtoan,
  //     ngaynhanhang
  //   ),
  //   async (err, result) => {
  //     if (err) throw err;

  //     for (let index = 0; index < result.length; index++) {
  //       console.log(result[index].id);
  //       dbconnect.query(
  //         billSQL.searchBillDetail(result[index].hoa_don_id),
  //         (e, r) => {
  //           if (e) throw e;
  //           data = [...data, { ...result, hdct: r }];
  //           if (index === result.length - 1) {
  //             res.send(data);
  //           }
  //         }
  //       );
  //     }
  //   }
  // );
});

router.post("/", (req, res) => {
  const {
    ngaynhanhang,
    ngaytrahang,
    trangthaidonID,
    khachhangID,
    ngaythanhtoan,
    listBillDetail,
  } = req.body;

  dbconnect.query(
    billSQL.insertBill,
    {
      trangthaidonID,
      khachhangID,
      ngaythanhtoan: null,
      ngaynhanhang,
      ngaytrahang,
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
      res.send(result);
    }
  );
});

router.put("/:id", (req, res) => {
  const {
    trangthaidonID,
    khachhangID,
    ngaynhanhang,
    ngaythanhtoan,
    ngaytrahang,
    checkDelete,
  } = req.body;
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
      if (err) throw err;
      res.send(result);
    }
  );
});

router.delete("/:id", (req, res) => {
  dbconnect.query(billSQL.deleteBill(req.params.id), (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

module.exports = router;
