const helperWrapper = require("../../helper/wrapper");
const bookingModel = require("./bookingModel");

module.exports = {
  createBooking: async (req, res) => {
    try {
      const {
        scheduleId,
        dateBooking,
        timeBooking,
        totalPayment,
        paymentMethod,
        seat,
      } = req.body;
      const setData = {
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
};
