const helperWrapper = require("../../helper/wrapper");
const bookingModel = require("./bookingModel");

module.exports = {
  createBooking: async (req, res) => {
    try {
      const {
        userId,
        scheduleId,
        dateBooking,
        timeBooking,
        totalPayment,
        paymentMethod,
        seat,
      } = req.body;
      const setData = {
        userId,
        scheduleId,
        dateBooking,
        timeBooking,
        totalPayment,
        paymentMethod,
        totalTicket: seat.length,
      };
      console.log(setData);

      const result = await bookingModel.createBookingMovie(setData);
      const seatt = seat.map((item) => item);
      console.log(seatt);
      await bookingModel.createBookinSeat(seatt, result.id);

      return helperWrapper.response(res, 200, "succes create data", result);
    } catch {
      return helperWrapper.response(res, 400, "baad request", null);
    }
  },
  getBookingByid: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await bookingModel.getBookingById(id);
      if (result.length <= 0) {
        return helperWrapper.response(
          res,
          404,
          `data by id ${id} not found`,
          null
        );
      }

      return helperWrapper.response(res, 200, "succes get data!", result);
    } catch {
      return helperWrapper.response(res, 400, "bad request", null);
    }
  },
  getBookingByUserId: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await bookingModel.getBookingByUserId(id);
      if (result.length <= 0) {
        return helperWrapper.response(
          res,
          404,
          `data by id ${id} not found`,
          null
        );
      }

      return helperWrapper.response(
        res,
        200,
        "succes get data booking from user id!",
        result
      );
    } catch {
      return helperWrapper.response(res, 400, "bad request", null);
    }
  },
  getBookingSeat: async (req, res) => {
    try {
      const { scheduleId, timeBooking, dateBooking } = req.query;
      const result = await bookingModel.getBookingSeat(
        scheduleId,
        timeBooking,
        dateBooking
      );
      let seat = [];
      result.map((item) => {
        seat = [...seat, ...item.seat.split(",")];
        return seat;
      });

      console.log(seat);

      if (result.length <= 0) {
        return helperWrapper.response(
          res,
          404,
          `data by id ${scheduleId} not found`,
          null
        );
      }

      return helperWrapper.response(res, 200, "succes get data!", seat);
    } catch {
      return helperWrapper.response(res, 400, "bad request", null);
    }
  },
  getBookingDashboard: async (req, res) => {
    try {
      const { premier, movieId, location } = req.query;
      // console.log(scheduleId);
      const movie = await bookingModel.getBookingById(movieId);
      const result = await bookingModel.getBookingDashboard(
        premier,
        movieId,
        location
      );
      // console.log(result);
      if (result.length <= 0) {
        return helperWrapper.response(
          res,
          404,
          `no data revenue for movie = ${movie[0].name} at ${premier} in ${location} `,
          null
        );
      }
      return helperWrapper.response(res, 200, "succes get data!", result);
    } catch {
      return helperWrapper.response(res, 400, "bad request", null);
    }
  },
  updateBooking: async (req, res) => {
    try {
      const { id } = req.params;
      if (id.length <= 0) {
        return helperWrapper.response(
          res,
          404,
          `data by id ${id} not found`,
          null
        );
      }
      const setData = "notActive";

      const result = await bookingModel.updateBooking(id, setData);
      return helperWrapper.response(res, 200, "succes use ticket!", result);
    } catch {
      return helperWrapper.response(res, 400, "bad request", null);
    }
  },
};
