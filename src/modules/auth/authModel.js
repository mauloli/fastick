const connection = require("../../config/mysql");

module.exports = {
  register: (data) =>
    new Promise((resolve, reject) => {
      const query = connection.query(
        "INSERT INTO user SET ?",
        data,
        (error, result) => {
          if (!error) {
            const newResult = {
              id: result.insertId,
              ...data,
            };
            delete newResult.password;
            resolve(newResult);
          } else {
            console.log(error);

            reject(new Error(error.sqlMessage));
          }
        }
      );
      console.log(query.sql);
    }),
  getUserByEmail: (email) =>
    new Promise((resolve, reject) => {
      connection.query(
        "SELECT * FROM user WHERE  email = ?",
        email,
        (err, res) => {
          if (!err) {
            resolve(res);
          } else {
            reject(new Error(err.sqlMessage));
          }
        }
      );
    }),
};
