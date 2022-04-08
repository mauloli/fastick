const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PW,
  database: process.env.MYSQL_DB,
});
connection.connect((error) => {
  if (error) {
    throw error;
  }
  console.log("you are connected");
});

module.exports = connection;
