const { google } = require("googleapis");
const { GoogleAuth } = require("google-auth-library");

const client = new GoogleAuth({
  keyFile: "./routes/service_acc_key.json",
  scopes: ["https://www.googleapis.com/auth/calendar"],
});

const calendar = google.calendar({
  version: "v3",
  auth: client,
});

module.exports = { calendar };
