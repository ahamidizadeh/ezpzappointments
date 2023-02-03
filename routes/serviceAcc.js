const { GoogleAuth } = require("google-auth-library");
const router = require("express").Router();
const { google } = require("googleapis");
const { check, validationResult } = require("express-validator");
const axios = require("axios");
const Events = require("../models/Events.js");
const client = new GoogleAuth({
  keyFile: "./routes/service_acc_key.json",
  scopes: ["https://www.googleapis.com/auth/calendar"],
});

const calendar = google.calendar({
  version: "v3",
  auth: client,
});

router.get("/", async (req, res) => {
  var startTime = new Date();
  var endTime = new Date();
  var bookedEvents;

  endTime.setDate(endTime.getDate() + 30);
  endTime.setHours(18, 0, 0, 0);
  startTime.setHours(8, 0, 0, 0);

  calendar.events.list(
    {
      calendarId: "ahamidizadeh@gmail.com",
      timeMin: startTime.toISOString(),
      timeMax: endTime.toISOString(),
      timeZone: "UTC",
      showDelegated: false,
      singleEvents: true,
      orderBy: "startTime",
    },
    (err, api) => {
      if (err) res.send(err);
      bookedEvents = api.data.items;

      if (bookedEvents) {
        bookedEvents.forEach((e) => {
          const newEvent = new Events({
            eventId: e.id,
            title: e.title,
            startTime: e.start.dateTime,
            endTime: e.end.dateTime,
            description: e.summary,
          });

          newEvent.save((err) => {
            if (err) {
              console.log(err);
            } else {
              console.log("event added to mongo!");
            }
          });
        });
        console.log(bookedEvents);
        res.json(bookedEvents);
      } else {
        console.log("there are no events for the next 30 days!");
      }
    }
  );
});

router.post(
  "/",
  [
    check("fieldData.name").isLength({ min: 3 }),
    check("fieldData.email").isEmail(),
    check("fieldData.phone").isMobilePhone(),
    check("fieldData.info").isLength({ min: 4 }).isString(),
    check("fieldData.email").isEmail(),
  ],
  async (req, res) => {
    // let eventStart = req.start;
    // let eventEnd = req.end;
    // if (!(eventStart instanceof Date)) {
    //   return res.status(400).json({ errors: "Invalid date format" });
    // }
    // if (!(eventEnd instanceof Date)) {
    //   return res.status(400).json({ errors: "Invalid date format end date" });
    // }
    const errors = validationResult(req.body);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const eventInfo = req.body;
    const newEvent = new Events({
      title: eventInfo.fieldDate["info"],
      startTime: eventInfo.start,
      endTime: eventInfo.end,
    });
    newEvent.save((err) => {
      if (err) {
        console.log(err);
      } else {
        console.log("new added");
      }
    });
    // const event = {
    //   calendarId: "ahamidizadeh@gmail.com",
    //   summary: eventInfo.fieldData.info,
    //   start: { dateTime: eventInfo.start },
    //   end: { dateTime: eventInfo.end },
    // };

    // calendar.events.insert({
    //   calendarId: "ahamidizadeh@gmail.com",
    //   resource: event,
    // });
    console.log(eventInfo);
    // axios
    //   .get("http://localhost:1234/service")
    //   .then((result) => {
    //     let data = result.data;
    //     console.log("Data", data);
    //   })
    //   .catch((error) => console.log(error));
    // // console.log(list.data);
    // // res.end(JSON.stringify(list));
    // res.json(list.data);
  }
);
module.exports = router;
