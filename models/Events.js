const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    default: mongoose.Types.ObjectId,
  },
  title: String,
  startTime: { type: Date, index: true, unique: true },
  endTime: { type: Date, index: true, unique: true },
  email: { type: String, trim: true, lowerCase: true },
  phone: { type: Number },
  location: String,
  description: String,
});

module.exports = mongoose.model("Event", eventSchema);
