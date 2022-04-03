const express = require("express");

const Router = express.Router();

const scheduleController = require("./scheduleController");
const middlewareRedis = require("../../middleware/redis");
const middlewareAuth = require("../../middleware/auth");

Router.get(
  "/",
  middlewareRedis.getScheduleRedis,
  scheduleController.getAllSchedule
);
Router.get("/:id", scheduleController.getScheduleById);
Router.get("/user/:id", scheduleController.getScheduleById);
Router.post("/", middlewareAuth.isAdmin, scheduleController.createSchedule);
Router.patch(
  "/:id",
  middlewareAuth.isAdmin,
  middlewareRedis.clearScheduleRedis,
  scheduleController.updateSchedule
);
Router.delete("/:id", scheduleController.deleteSchedule);
// Router.delete("/:id", scheduleController.deleteschedule);

// Router.get("/hello", (req, res) => {
//   res.status(200);
//   res.send("helo word");
// }); a

module.exports = Router;
