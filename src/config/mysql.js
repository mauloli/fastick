const mysql = require("mysql2");
require("dotenv").config();

const connection = mysql.createConnection({
  host: process.env.HOST,
  user: "root",
  password: "",
  database: process.env.DB,
});
connection.connect((error) => {
  if (error) {
    throw error;
  }
  console.log("you are connected");
  console.log(process.env.PW);
});

module.exports = connection;
