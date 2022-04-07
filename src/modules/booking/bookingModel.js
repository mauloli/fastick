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
      const sqlQuery = `INSERT INTO bookingseat SET seat = '${data}',bookingid = ?`;
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
  getBookingById: (id) =>
    new Promise((resolve, reject) => {
      connection.query(
        `SELECT b.*,movie.name,movie.category FROM booking as b 
        JOIN schedule as s ON b.scheduleId = s.id 
        JOIN movie ON s.movieid = movie.id WHERE b.id = ?`,
        id,
        (err, res) => {
          if (!err) {
            resolve(res);
          } else {
            console.log(err.sqlMessage);
            reject(new Error(err.sqlMessage));
          }
        }
      );
    }),
  getBookingByUserId: (id) =>
    new Promise((resolve, reject) => {
      connection.query(
        `SELECT booking.*,bookingseat.seat, movie.name, movie.category FROM booking 
        JOIN schedule ON booking.scheduleId = schedule.id JOIN bookingseat ON bookingseat.bookingid =booking.id 
        JOIN movie on schedule.movieid = movie.id WHERE userId = ?`,
        id,
        (err, res) => {
          if (!err) {
            resolve(res);
          } else {
            console.log(err.sqlMessage);
            reject(new Error(err.sqlMessage));
          }
        }
      );
    }),
  getBookingSeat: (scheduleId, timeBooking, dateBooking) =>
    new Promise((resolve, reject) => {
      const query = connection.query(
        `SELECT bookingseat.seat FROM booking 
        JOIN bookingseat ON booking.id = bookingseat.bookingid 
        WHERE timeBooking = '${timeBooking}' AND dateBooking ='${dateBooking}' AND booking.scheduleId = ?`,
        scheduleId,
        (err, res) => {
          if (!err) {
            resolve(res);
          } else {
            console.log(err.sqlMessage);
            reject(new Error(err.sqlMessage));
          }
        }
      );
      console.log(query.sql);
    }),
  getBookingDashboard: (premier, movieId, location) =>
    new Promise((resolve, reject) => {
      connection.query(
        `SELECT MONTH(booking.createdAt) AS month, SUM(totalPayment) AS revenue FROM booking 
        JOIN schedule ON booking.scheduleId = schedule.id WHERE schedule.premier = ? 
        AND schedule.movieId = ? AND location =? GROUP BY month`,
        [premier, movieId, location],
        (err, res) => {
          if (!err) {
            resolve(res);
          } else {
            console.log(err.sqlMessage);
            reject(new Error(err.sqlMessage));
          }
        }
      );
      // console.log(query.sql);
    }),
  updateBooking: (data, id) =>
    new Promise((resolve, reject) => {
      const query = connection.query(
        `UPDATE booking SET ? WHERE id = ?`,
        [data, id],
        (error) => {
          if (!error) {
            const newResult = {
              id,
              data,
            };
            resolve(newResult);
          } else {
            reject(new Error(error.sqlMessage));
          }
        }
      );
      console.log(query.sql);
    }),
};
