const router = require('./setUpRouter').Router();
const { Bill } = require("../config/models/billModel");
const { Customer } = require("../config/models/customerModel");
const { Employee } = require("../config/models/employeeModel");
const { StatusBill } = require("../config/models/statusBillModel");
const { BillDetail } = require("../config/models/billDetailModel");
const { Service } = require("../config/models/serviceModel");
const { isEmpty } = require("../utils/validate")

const getListBill =  async (req, res) => {
  const { trangthaidonId, khachhangId } = req.query;
  try {
    let bill;
    let condition = {}
    if (!isEmpty(trangthaidonId)) condition.trangthaidonId = trangthaidonId;
    if (!isEmpty(khachhangId)) condition.khachhangId = khachhangId;

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
      where: condition
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

    res.send({ error_code: 0, data: newData, message: null });
  } catch (err) {
    res.json({
      error_code: 500,
      message: "Something went wrong, try again later",
      error_debug: err,
    });
  }
};

const addBill =  async (req, res) => {
  try {
    const {
      ngaynhanhang,
      ngaytrahang,
      trangthaidonId,
      khachhangId,
      listBillDetail,
    } = req.body;

    if (isEmpty(ngaynhanhang) || isEmpty(ngaytrahang) || !isEmpty(khachhangId) || isEmpty(listBillDetail)) {
     return res.json({ error_code: 404, message: "Invalid data" });
    }

    const bill = await Bill.create({
      trangthaidonId: trangthaidonId,
      khachhangId: khachhangId,
      ngaynhanhang: ngaynhanhang,
      ngaytrahang: ngaytrahang,
      nhanvienId: req.id,
    });

    for (let i = 0; i < listBillDetail.length; i++) {
      BillDetail.create({
        dichvuId: listBillDetail[i].dichvuId,
        soluong: listBillDetail[i].soluong,
        hoadonId: bill.id,
      });
    }
    return res.send({ error_code: 0, result: bill, message: null });
  } catch (err) {
    res.json({
      error_code: 500,
      message: "Something went wrong, try again later",
      error_debug: err,
    });
  }
};

const updateBill = async (req, res) => {
  try {
    const {
      trangthaidonId,
      khachhangId,
      ngaynhanhang,
      ngaythanhtoan,
      ngaytrahang,
    } = req.body;

    if (
      isEmpty(ngaynhanhang) ||
      isEmpty(ngaytrahang) ||
      isEmpty(khachhangId) ||
      isEmpty(trangthaidonId) ||
      isEmpty(ngaythanhtoan) ||
      isEmpty(req.params.id)
    ) {
     return res.send({ error_code: 404, message: "Invalid data" });
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

   return res.send({ error_code: 0, data: bill, message: null });
  } catch (err) {
    res.json({
      error_code: 500,
      message: "Something went wrong, try again later",
      error_debug: err,
    });
  }
};

const deleteBill =  async (req, res) => {
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

   return res.send({ error_code: 0, data: bill, message: null });
  } catch (err) {
    res.json({
      error_code: 500,
      message: "Something went wrong, try again later",
      error_debug: err,
    });
  }
};

router.getRoute('/list', getListBill, true)
router.postRoute('/', addBill, true)
router.putRoute('/:id', updateBill, true)
router.putRoute('/delete_bill/:id', deleteBill, true)


module.exports = router; 
