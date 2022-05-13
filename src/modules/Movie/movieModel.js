const connection = require("../../config/mysql");

module.exports = {
  getCountMovie: (searchName, month) =>
    new Promise((resolve, reject) => {
      const query = connection.query(
        `SELECT COUNT(*) AS total FROM movie WHERE name LIKE '%${searchName}%' ${month}`,
        (err, res) => {
          if (!err) {
            resolve(res[0].total);
          } else {
            console.log(err.sqlMessage);
            reject(new Error(err.sqlMessage));
          }
        }
      );
      console.log(query.sql);
    }),
  getAllMovie: (limit, offset, searchName, sortMovie, month) =>
    new Promise((resolve, reject) => {
      const query = connection.query(
        `SELECT * FROM movie WHERE name LIKE '%${searchName}%' ${month} ORDER BY ${sortMovie} LIMIT ? OFFSET ?`,
        [limit, offset],
        (err, res) => {
          if (!err) {
            // console.log(res);
            resolve(res);
          } else {
            console.log(err.sqlMessage);
            reject(new Error(err.sqlMessage));
          }
        }
      );
      console.log(query.sql);
    }),
  getMovieByID: (id) =>
    new Promise((resolve, reject) => {
      connection.query(`SELECT * FROM movie WHERE ID = ?`, id, (err, res) => {
        if (!err) {
          resolve(res);
        } else {
          console.log(err.sqlMessage);
          reject(new Error(err.sqlMessage));
        }
      });
    }),
  getMovieByReleaseMonth: (month) =>
    new Promise((resolve, reject) => {
      connection.query(
        `SELECT * FROM movie WHERE MONTH(movie.releaseDate) = ?`,
        month,
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

  createMovie: (data) =>
    new Promise((resolve, reject) => {
      const query = connection.query(
        "INSERT INTO movie SET ?",
        data,
        (error, result) => {
          if (!error) {
            const newResult = {
              id: result.insertId,
              ...data,
            };
            resolve(newResult);
          } else {
            reject(new Error(error.sqlMessage));
          }
        }
      );
      console.log(query.sql);
    }),
  updateMovie: (id, data) =>
    new Promise((resolve, reject) => {
      const query = connection.query(
        "UPDATE movie SET ? WHERE id = ?",
        [data, id],
        (error) => {
          if (!error) {
            const newResult = {
              id,
              ...data,
            };
            resolve(newResult);
          } else {
            reject(new Error(error.sqlMessage));
          }
        }
      );
      console.log(query.sql);
    }),
  deleteMovie: (id) =>
    new Promise((resolve, reject) => {
      connection.query(`DELETE FROM movie WHERE ID = ?`, id, (err, res) => {
        if (!err) {
          resolve(res);
        } else {
          console.log(err.sqlMessage);
          reject(new Error(err.sqlMessage));
        }
      });
    }),
};
