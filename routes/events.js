const router = require("express").Router();
const mongoose = require("mongoose");
const Events = require("../models/Events.js");
const { check, validationResult } = require("express-validator");
const sgMail = require("@sendgrid/mail");

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
      title: eventInfo.data["info"],
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
    const email = {
      to: `${eventInfo.data["email"]}`,
      from: "ezpz.makeappointments@gmail.com",
      subject: "Confirmation Email",
      html: `<h1>Hi ${eventInfo.data["name"]}</h1>
    <p>Thank you for booking an event with Ali. Your event details are as follows:</p>
           <p>Event Name: ${eventInfo.data["info"]}</p>
           <p>Event Date: ${eventInfo.start}</p>
           <p>To cancel your event, please click <a>here</a>.</p>`,
    };

    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    sgMail
      .send(email)
      .then(() => console.log("email was sent!"))
      .catch((error) => console.log("error:", error));
  }
);

module.exports = router;
