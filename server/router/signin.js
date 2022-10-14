const express = require("express");
const dbconnect = require("../config/dbconnect");
const router = express.Router();
const signupSQL = require("../sql/signup");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { promisify } = require("util");

router.post("/", (req, res) => {
  try {
    const { phoneNumber, password } = req.body;

    dbconnect.query(signupSQL.searchAcc(), { phoneNumber }, (_, result) => {
      if (!result) {
        res.send({
          message: "PhoneNumber or Password is incorrect",
        });
      } else {
        const id = result[0].id;

        const token = jwt.sign({ id }, process.env.JWT_SECRET, {
          expiresIn: "30m",
        });

        res.send("userSave", {
          token,
          expires: new Date(Date.now() + 30 * 60 * 1000),
        });
      }
    });
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
