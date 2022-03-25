const connection = require("../../config/mysql");

module.exports = {
  getCountSchedule: () =>
    new Promise((resolve, reject) => {
      connection.query("SELECT COUNT(*) AS total FROM schedule", (err, res) => {
        if (!err) {
          resolve(res[0].total);
        } else {
          console.log(err.sqlMessage);
          reject(new Error(err.sqlMessage));
        }
      });
    }),
  getAllSchedule: (limit, offset) =>
    new Promise((resolve, reject) => {
      // LIMIT ? OFFSET
      connection.query(
        "SELECT * FROM schedule LIMIT ? OFFSET ?",
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
      const query = connection.query(
        "INSERT INTO schedule SET ?",
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
  updateSchedule: (id, data) =>
    new Promise((resolve, reject) => {
      const query = connection.query(
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
      console.log(query.sql);
    }),
  deleteMobvie: (id) =>
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
