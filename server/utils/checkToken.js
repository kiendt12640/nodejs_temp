const jwt = require("jsonwebtoken");

const checkToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  try {
    if (authHeader) {
      const token = authHeader.split(" ")[1];
      jwt.verify(token, "111111", (err, data) => {
        if (err) throw err;
        req.id = data.id;
        next();
      });
    } else {
      res.send({ error_code: 498, message: "Token invalid" });
    }
  } catch (error) {
    res.send({ error_code: 498, message: "Token invalid" });
  }
};

module.exports = { checkToken };
