const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "maulanasholihinoli@gmail.com",
    pass: "fduaexzvsklhzanl",
  },
});

module.exports = transporter;
