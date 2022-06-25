/* eslint-disable eqeqeq */
const { v4: uuidv4 } = require("uuid");
const helperWrapper = require("../../helper/wrapper");
const helperMidtrans = require("../../helper/midtrans");
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
        id: uuidv4(),
        userId,
        scheduleId,
        dateBooking,
        timeBooking,
        totalPayment,
        paymentMethod,
        totalTicket: seat.length,
      };
      // console.log(setData);

      const result = await bookingModel.createBookingMovie(setData);
      const seatt = seat.map((item) => item);
      await bookingModel.createBookinSeat(seatt, result.id);

      const resultMidtrans = await helperMidtrans.post(setData);
      return helperWrapper.response(res, 200, "succes create data", {
        ...result,
        seats: req.body.seat,
        redirectUrl: resultMidtrans.redirect_url,
      });
    } catch (error) {
      console.log(error);

      return helperWrapper.response(res, 400, "baad request", null);
    }
  },

  postMidtransNotification: async (request, response) => {
    try {
      console.log(request.body);
      const result = await helperMidtrans.notif(request.body);
      const orderId = result.order_id;
      const transactionStatus = result.transaction_status;
      const fraudStatus = result.fraud_status;

      console.log(
        `Transaction notification received. Order ID: ${orderId}. Transaction status: ${transactionStatus}. Fraud status: ${fraudStatus}`
      );

      // Sample transactionStatus handling logic
      let setData = {};
      if (transactionStatus == "capture") {
        // capture only applies to card transaction, which you need to check for the fraudStatus
        if (fraudStatus == "challenge") {
          // TODO set transaction status on your databaase to 'challenge'
          // UBAH STATUS PEMBAYARAN MENJADI PENDING
          // PROSES MEMANGGIL MODEL untuk mengubah data di dalam database
          // id = orderId;
          setData = {
            paymentMethod: result.payment_type,
            statusPayment: "PENDING",
            // updatedAt: ...
          };
        } else if (fraudStatus == "accept") {
          // TODO set transaction status on your databaase to 'success'
          // UBAH STATUS PEMBAYARAN MENJADI SUCCESS
          // id = orderId;
          setData = {
            paymentMethod: result.payment_type,
            statusPayment: "SUCCESS",
            // updatedAt: ...
          };
        }
      } else if (transactionStatus == "settlement") {
        // TODO set transaction status on your databaase to 'success'
        // UBAH STATUS PEMBAYARAN MENJADI SUCCESS
        // id = orderId;
        setData = {
          paymentMethod: result.payment_type,
          statusPayment: "SUCCESS",
          // updatedAt: ...
        };
        console.log(setData);
        console.log(
          `Sukses melakukan pembayaran dengan id ${orderId} dan data yang diubah ${JSON.stringify(
            setData
          )}`
        );
        await bookingModel.updateBooking(setData, orderId);
      } else if (transactionStatus == "deny") {
        // TODO you can ignore 'deny', because most of the time it allows payment retries
        // and later can become success
        // UBAH STATUS PEMBAYARAN MENJADI FAILED
      } else if (
        transactionStatus == "cancel" ||
        transactionStatus == "expire"
      ) {
        // TODO set transaction status on your databaase to 'failure'
        // UBAH STATUS PEMBAYARAN MENJADI FAILED
      } else if (transactionStatus == "pending") {
        // TODO set transaction status on your databaase to 'pending' / waiting payment
        // UBAH STATUS PEMBAYARAN MENJADI PENDING
      }
      return helperWrapper.response(
        response,
        200,
        "success update data",
        setData
      );
    } catch (error) {
      return helperWrapper.response(response, 400, "Bad Request", null);
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

      // console.log(seat);

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
    } catch (err) {
      console.log(err.response);
      return helperWrapper.response(res, 400, "bad request", null);
    }
  },
};
