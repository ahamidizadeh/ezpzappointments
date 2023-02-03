const router = require("express").Router();
const mongoose = require("mongoose");
const Events = require("../models/Events.js");

router.get("/", (req, res) => {
  const pickedDay = new Date(req.query.date);

  const startOfDay = new Date(
    pickedDay.getFullYear(),
    pickedDay.getMonth(),
    pickedDay.getDate()
  );
  const endOfDay = new Date(
    pickedDay.getFullYear(),
    pickedDay.getMonth(),
    pickedDay.getDate() + 1
  );
  Events.find(
    { startTime: { $gte: startOfDay, $lt: endOfDay } },
    (err, events) => {
      if (err) {
        res.status(500).send(err);
      }
      return res.json(events);
    }
  );
});

router.post("/", (req, res) => {});

module.exports = router;
