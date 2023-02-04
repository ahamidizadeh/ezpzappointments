const router = require("express").Router();
const mongoose = require("mongoose");
const Events = require("../models/Events.js");

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

router.post("/", (req, res) => {});

module.exports = router;
