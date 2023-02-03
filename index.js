const express = require("express");
const axios = require("axios");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const auth = require("./routes/auth");
const events = require("./routes/events");
const opn = require("open");
const bodyParser = require("body-parser");
const { google } = require("googleapis");
const service = require("./routes/serviceAcc");
const app = express();
const PORT = 1234;
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
require("dotenv").config();
app.use("/events", events);
app.use("/auth", auth);
app.use("/service", service);
app.get("/events", async (req, res) => {});
app.post("/eventInfo", (req, res) => {
  // const hour = Number(req.body.hour.substring(0, 2));
  // reservation.setHours(hour);
  // const calendar = google.calendar({ version: "v3" });
  // const event = {
  //   summary: "Appointment",
  //   location: "Somewhere",
  //   start: {
  //     dateTime: new Date(reservation),
  //     timeZone: "America/Los_Angeles",
  //   },
  //   end: {
  //     dateTime: new Date(reservation.getTime() + 60 * 60 * 1000),
  //     timeZone: "America/Los_Angeles",
  //   },
  // };
  // calendar.events.insert(
  //   { calendarId: "primary", resource: event },
  //   (err, event) => {
  //     if (err) return console.log("The API returned an error: " + err);
  //     console.log(`Event created: ${event.data.htmlLink}`);
  //   }
  // );
  // res.status(200).end("nice work today!");
});

app.listen(PORT, () => console.log("listening on port: ", PORT));

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.set("strictQuery", false);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("Connected to MongoDB!");
});
