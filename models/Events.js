const mongoose = require("mongoose");
const { calendar } = require("../config.js");

const eventSchema = new mongoose.Schema({
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    default: mongoose.Types.ObjectId,
  },
  title: String,
  user: { type: String },
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
    id: doc.eventId,
    start: { dateTime: new Date(doc.startTime) },
    end: { dateTime: new Date(doc.endTime) },
    colorId: 3,
  };
  try {
    await calendar.events.insert(
      {
        calendarId: "ahamidizadeh@gmail.com",
        resource: event,
      },
      (err, res) => {
        console.log(`${doc.title} was added to google calendar`);
      }
    );
  } catch (error) {
    console.error(error);
  }
});
const Events = mongoose.model("Event", eventSchema);

Events.on("deleteEvent", async (eventId) => {
  console.log("this is the type of the eventId:", typeof eventId);

  try {
    await calendar.events.delete({
      calendarId: "ahamidizadeh@gmail.com",
      eventId: eventId,
    });
    console.log("event deleted from google calendar success!");
  } catch (error) {
    console.log(`not deleting from calendar api here is why:`, error);
  }
});

module.exports = Events;
