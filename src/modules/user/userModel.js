const connection = require("../../config/mysql");

module.exports = {
  getUserById: (id) =>
    new Promise((resolve, reject) => {
      connection.query(
        `SELECT id,FirstName,lastName,noTelp,image FROM user WHERE ID = ?`,
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
  getUserByImage: (id) =>
    new Promise((resolve, reject) => {
      connection.query(
        `SELECT image FROM user WHERE ID = ?`,
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
  updateUser: (id, data) =>
    new Promise((resolve, reject) => {
      const query = connection.query(
        "UPDATE user SET ? WHERE id = ?",
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
  updateUserImg: (id, data) =>
    new Promise((resolve, reject) => {
      const query = connection.query(
        `UPDATE user SET image = '${data.image}' WHERE id = ${id}`,

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
  updatePassword: (id, data) =>
    new Promise((resolve, reject) => {
      const query = connection.query(
        "UPDATE user SET ? WHERE id = ?",
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
};
