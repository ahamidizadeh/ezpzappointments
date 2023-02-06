const { GoogleAuth } = require("google-auth-library");
const router = require("express").Router();
const { google } = require("googleapis");
const { check, validationResult } = require("express-validator");
const axios = require("axios");
const mongoose = require("mongoose");
const sgMail = require("@sendgrid/mail");
const Events = require("../models/Events.js");

router.get("/", async (req, res) => {
  // try {
  //   const newlyAddedEvents = await Events.find({});
  //   for (const event of newlyAddedEvents) {
  //     await calendar.events.insert({
  //       calendarId: "ahamidizadeh@gmail.com",
  //       resource: event,
  //     });
  //   }
  // } catch (error) {
  //   console.log(error);
  // }
});
// var startTime = new Date();
// var endTime = new Date();
// var bookedEvents;

// endTime.setDate(endTime.getDate() + 30);
// endTime.setHours(18, 0, 0, 0);
// startTime.setHours(8, 0, 0, 0);

// calendar.events.list(
//   {
//     calendarId: "ahamidizadeh@gmail.com",
//     timeMin: startTime.toISOString(),
//     timeMax: endTime.toISOString(),
//     timeZone: "UTC",
//     showDelegated: false,
//     singleEvents: true,
//     orderBy: "startTime",
//   },
//   (err, api) => {
//     if (err) res.send(err);
//     bookedEvents = api.data.items;

//     if (bookedEvents) {
//       bookedEvents.forEach((e) => {
//         const newEvent = new Events({
//           eventId: e.id,
//           title: e.title,
//           startTime: e.start.dateTime,
//           endTime: e.end.dateTime,
//           description: e.summary,
//         });

//         newEvent.save((err) => {
//           if (err) {
//             console.log(err);
//           } else {
//             console.log("event added to mongo!");
//           }
//         });
//       });
//       console.log(bookedEvents);
//       res.json(bookedEvents);
//     } else {
//       console.log("there are no events for the next 30 days!");
//     }
//   }
// );

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
    // const email = {
    //   to: `${eventInfo.data["email"]}`,
    //   from: "ezpz.makeappointments@gmail.com",
    //   subject: "Confirmation Email",
    //   html: `<h1>Hi ${eventInfo.data["name"]}</h1>
    //   <p>Thank you for booking an event with Ali. Your event details are as follows:</p>
    //          <p>Event Name: ${eventInfo.data["info"]}</p>
    //          <p>Event Date: ${eventInfo.start}</p>
    //          <p>To cancel your event, please click <a>here</a>.</p>`,
    // };

    const newEvent = new Events({
      title: `${eventInfo.data["info"]} with ${eventInfo.data["name"]}`,
      email: eventInfo.data["email"],
      phone: eventInfo.data["phone"],
      startTime: eventInfo.start,
      endTime: eventInfo.end,
    });

    newEvent.save((err) => {
      if (err) {
        console.log(err);
      }
    });

    //   sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    //   sgMail
    //     .send(email)
    //     .then(() => console.log("email was sent!"))
    //     .catch((error) => console.log("error:", error));
    // }
  }
);
module.exports = router;
