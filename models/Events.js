const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  eventId: { type: String, unique: true },
  title: String,
  startTime: { type: Date, index: true, unique: true },
  endTime: { type: Date, index: true, unique: true },
  location: String,
  description: String,
});

module.exports = mongoose.model("Event", eventSchema);
