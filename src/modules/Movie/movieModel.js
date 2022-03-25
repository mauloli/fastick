const connection = require("../../config/mysql");

module.exports = {
  getCountMovie: () =>
    new Promise((resolve, reject) => {
      connection.query("SELECT COUNT(*) AS total FROM movie", (err, res) => {
        if (!err) {
          resolve(res[0].total);
        } else {
          console.log(err.sqlMessage);
          reject(new Error(err.sqlMessage));
        }
      });
    }),
  getAllMovie: (limit, offset) =>
    new Promise((resolve, reject) => {
      connection.query(
        "SELECT * FROM movie LIMIT ? OFFSET ?",
        [limit, offset],
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
  deleteMobvie: (id) =>
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
  getMovieByName: (name) =>
    new Promise((resolve, reject) => {
      connection.query(`SELECT * FROM movie WHERE ?`, name, (err, res) => {
        if (!err) {
          resolve(res);
        } else {
          console.log(err.sqlMessage);
          reject(new Error(err.sqlMessage));
        }
      });
    }),
};
