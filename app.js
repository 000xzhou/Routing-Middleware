const express = require("express");
const ExpressError = require("./expressError");

const itemsRoutes = require("./itemsRoutes");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/items", itemsRoutes);

app.use(function (req, res) {
  return new ExpressError("Not Found", 404);
});

app.use(function (err, req, res, next) {
  let status = err.status || 500;
  return res.status(status).json({
    error: {
      message: err.message,
      status: status,
    },
  });
});

module.exports = app;
x;
