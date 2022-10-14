const express = require("express");
const dbconnect = require("../config/dbconnect");
const router = express.Router();
const signupSQL = require("../sql/signup");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { promisify } = require("util");

router.get("/", (req, res) => {
  dbconnect.query(signupSQL.searchAcc(), (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

router.post("/", async (req, res) => {
  const { name, phoneNumber, trangthaiID, password } = req.body;

  let hashedPassword = await bcrypt.hash(password, 8);

  dbconnect.query(
    signupSQL.insertAcc,
    { name, phoneNumber, trangthaiID, password: hashedPassword },
    (err, result) => {
      if (err) throw err;
      res.send(result);
    }
  );
});

module.exports = router;
