const router = require("express").Router();
const mongoose = require("mongoose");
const Events = require("../models/Events.js");
const { check, validationResult } = require("express-validator");
const sgMail = require("@sendgrid/mail");
const { calendar } = require("../config.js");

router.get("/deleteEvent/:eventId", async (req, res) => {
  const eventID = req.params.eventId;
  Events.deleteOne({ eventId: eventID }, (err) => {
    if (err) {
      return res.status(500).send(err);
    }
    Events.emit("deleteEvent", eventID);
    res.send("Event deleted");
  });
});
router.get("/list", async (req, res) => {
  const startOfFebruary = new Date(
    Date.UTC(new Date().getFullYear(), 1, 1, 0, 0, 0)
  );
  const endOfFebruary = new Date(
    Date.UTC(new Date().getFullYear(), 2, 1, 0, 0, 0)
  );
  const list = await calendar.events.list(
    {
      calendarId: "ahamidizadeh@gmail.com",
      timeMin: startOfFebruary.toISOString(),
      timeMax: endOfFebruary.toISOString(),
      singleEvents: true,
      orderBy: "startTime",
    },
    (err, list) => {
      if (err) console.log(`list cant be retrieved: ${err}`);
      res.send(list.data.items);
    }
  );
});

router.get("/", async (req, res) => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  const nextYear = new Date();
  nextYear.setFullYear(nextYear.getFullYear() + 1);

  const events = await Events.find({
    startTime: {
      $gte: yesterday,
      $lt: nextYear,
    },
  });

  res.send(events);
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
    const errors = validationResult(req.body);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    const eventInfo = req.body;
    const newEvent = new Events({
      user: eventInfo.data["name"],
      title: `${eventInfo.data["info"]} with ${eventInfo.data["name"]}`,
      email: eventInfo.data["email"],
      phone: eventInfo.data["phone"],
      startTime: eventInfo.start,
      endTime: eventInfo.end,
    });
    newEvent.save((err) => {
      if (err) {
        res.send(err);
      } else {
        res.send(
          "Thanks for booking! you will receive a confirmation email shortly"
        );
      }
    });
    const cancelLink = `http://localhost:1234/events/deleteEvent/${newEvent.eventId}`;
    const email = {
      to: `${eventInfo.data["email"]}`,
      from: "ezpz.makeappointments@gmail.com",
      subject: "Appointment Confirmed",
      html: `<h1>Hi ${eventInfo.data["name"]}</h1>
    <p>Thank you for booking an event with Ali. Your event details are as follows:</p>
           <p>Event Name: ${eventInfo.data["info"]}</p>
           <p>Event Date: ${new Date(eventInfo.start).toDateString()}</p>
           <p>Event Time: ${new Date(
             eventInfo.start
           ).toLocaleTimeString()} - ${new Date(
        eventInfo.end
      ).toLocaleTimeString()}</p>
           <p>To cancel your event, please click <a href=${cancelLink}>cancel appointment</a>.</p>
           <p>Thank you, Ali.</p>`,
    };

    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    sgMail
      .send(email)
      .then(() => console.log("email was sent!"))
      .catch((error) => console.log("error:", error));
  }
);

module.exports = router;
