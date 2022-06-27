const admin = require("firebase-admin");

const serviceAccount = require("./fastick-93c88-firebase-adminsdk-vhd1l-639b54fc8c.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;
