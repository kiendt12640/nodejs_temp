const express = require("express");
const cors = require("cors");
const dashboard = require("./router/dashboard");
const trangthai = require("./router/trangthai");
const trangThaiDon = require("./router/trangThaiDon");
const bill = require("./router/bill");
const customer = require("./router/customer");
const service = require("./router/services");

const app = express();
app.use(express.json());

app.use(cors());

app.use("/dashboard", dashboard);
app.use("/bill", bill);
app.use("/trangthai", trangthai);
app.use("/trangthaidon", trangThaiDon);
app.use("/customer", customer);
app.use("/service", service);

app.listen("5000", function () {
  console.log("Server listening on port 5000");
});
