const connection = require("../../config/mysql");

module.exports = {
  getCountSchedule: (searchMovieId, location) =>
    new Promise((resolve, reject) => {
      connection.query(
        `SELECT COUNT(*) AS total FROM schedule WHERE location LIKE '%${location}%' ${
          !searchMovieId ? "" : "AND movieid = ?"
        }`,
        searchMovieId,
        (err, res) => {
          if (!err) {
            resolve(res[0].total);
          } else {
            console.log(err.sqlMessage);
            reject(new Error(err.sqlMessage));
          }
        }
      );
    }),
  getAllSchedule: (
    limit,
    offset,
    searchMovieId,
    searchLocation,
    sortSchedule
  ) =>
    new Promise((resolve, reject) => {
      // LIMIT ? OFFSET test
      connection.query(
        `SELECT s.*, m.name,m.category,m.synopsis,m.createdAt FROM movie AS m 
        JOIN schedule AS s ON m.id = s.movieId WHERE ${
          !searchMovieId ? "" : "movieid = ? AND"
        } location LIKE '%${searchLocation}%' ORDER 
        BY ${sortSchedule} LIMIT ? OFFSET ?`,
        [searchMovieId, limit, offset],
        (err, res) => {
          if (!err) {
            resolve(res);
          } else {
            console.log(err.sqlMessage);
            reject(new Error(err.sqlMessage));
          }
        }
      );
      // console.log(searchMovieId);
      // console.log(query.sql);
    }),
  getScheduleById: (id) =>
    new Promise((resolve, reject) => {
      connection.query(
        `SELECT * FROM schedule WHERE ID = ?`,
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
  createSchedule: (data) =>
    new Promise((resolve, reject) => {
      connection.query("INSERT INTO schedule SET ?", data, (error, result) => {
        if (!error) {
          const newResult = {
            id: result.insertId,
            ...data,
          };
          resolve(newResult);
        } else {
          reject(new Error(error.sqlMessage));
        }
      });
      // console.log(query.sql);
    }),
  updateSchedule: (id, data) =>
    new Promise((resolve, reject) => {
      connection.query(
        "UPDATE schedule SET ? WHERE id = ?",
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
      // console.log(query.sql);
    }),
  deleteSchedule: (id) =>
    new Promise((resolve, reject) => {
      connection.query(`DELETE FROM schedule WHERE ID = ?`, id, (err, res) => {
        if (!err) {
          resolve(res);
        } else {
          console.log(err.sqlMessage);
          reject(new Error(err.sqlMessage));
        }
      });
    }),
};
