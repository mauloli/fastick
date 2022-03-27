const express = require("express");

const Router = express.Router();

const scheduleController = require("./scheduleController");

Router.get("/", scheduleController.getAllSchedule);
Router.get("/:id", scheduleController.getScheduleById);
Router.post("/", scheduleController.createSchedule);
Router.patch("/:id", scheduleController.updateSchedule);
// Router.delete("/:id", scheduleController.deleteschedule);

// Router.get("/hello", (req, res) => {
//   res.status(200);
//   res.send("helo word");
// }); a

module.exports = Router;
