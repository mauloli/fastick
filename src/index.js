const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const xss = require("xss-clean");
const compression = require("compression");
const bodyParser = require("body-parser");
require("dotenv").config();
const routerNav = require("./routes");

const app = express();
const port = process.env.PORT || 3001;

app.use(morgan("dev"));
app.use(cors());
app.options("*", cors());
app.use(helmet());
app.use(xss());
app.use(compression());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static("public"));

app.use("/", routerNav);
app.use("/*", (req, res) => {
  res.status(400).send("path not found");
});
// app.get("/hello", (req, res) => {
//   res.status(200);
//   res.send("hello word");
// });

app.listen(port, () => {
  console.log(`express app is listen on port ${port}`);
});
