const mongoose = require("mongoose");
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
  createdAt: { type: Date, default: Date.now },
});

eventSchema.post("save", async (doc) => {
  const event = {
    summary: doc.title,
    start: { dateTime: new Date(doc.startTime) },
    end: { dateTime: new Date(doc.endTime) },
    colorId: 3,
  };
  try {
    await calendar.events.insert({
      calendarId: "ahamidizadeh@gmail.com",
      resource: event,
    });
    console.log(`${doc.title} was added to google calendar`);
  } catch (error) {
    console.error(error);
  }
});

module.exports = mongoose.model("Event", eventSchema);
