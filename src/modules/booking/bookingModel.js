const connection = require("../../config/mysql");

module.exports = {
  createBookingMovie: (data) =>
    new Promise((resolve, reject) => {
      const query = connection.query(
        "INSERT INTO booking SET ?",
        data,
        (error, result) => {
          if (!error) {
            const newResult = {
              id: result.insertId,
              ...data,
            };
            console.log(newResult);
            resolve(newResult);
          } else {
            reject(new Error(error.sqlMessage));
          }
        }
      );
      console.log(query.sql);
    }),
  createBookinSeat: (data, id) =>
    new Promise((resolve, reject) => {
      const sqlQuery = `INSERT INTO bookingseat SET seat = '[${data}]',bookingid = ?`;
      const query = connection.query(sqlQuery, [id], (error, result) => {
        if (!error) {
          const newResult = {
            ...data,
            id: result.insertId,
          };
          resolve(newResult);
        } else {
          reject(new Error(error.sqlMessage));
        }
      });
      console.log(query.sql);
    }),
};
