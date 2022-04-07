const midtransClient = require("midtrans-client");

const snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: "SB-Mid-server-hd0PM8eKzOqmaEDXOqof6m-w",
  clientKey: "SB-Mid-client-GHzJ1NgGLtj51xUx",
});

module.exports = {
  post: (data) =>
    new Promise((resolve, reject) => {
      console.log("Post midtrans run");
      const parameter = {
        transaction_details: {
          order_id: data.id,
          gross_amount: data.totalPayment,
        },
        credit_card: {
          secure: true,
        },
      };
      snap
        .createTransaction(parameter)
        .then((transaction) => {
          // transaction token
          // const transactionToken = transaction.token;
          // console.log("transactionToken:", transactionToken);
          //   console.log(transaction);
          //   {
          //     token: '77af457d-84a1-4eaa-8b42-49c2f0a1f7c3',
          //     redirect_url: 'https://app.sandbox.midtrans.com/snap/v2/vtweb/77af457d-84a1-4eaa-8b42-49c2f0a1f7c3'
          //   }
          resolve(transaction);
        })
        .catch((error) => {
          reject(error);
        });
    }),
  notif: (data) =>
    new Promise((resolve, reject) => {
      console.log("NOTIF MIDTRANS RUN");
      snap.transaction
        .notification(data)
        .then((statusResponse) => {
          //   console.log(statusResponse);
          resolve(statusResponse);
        })
        .catch((error) => {
          reject(error);
        });
    }),
};
