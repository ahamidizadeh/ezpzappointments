const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema({
  summary: {
    type: String,
    require: true,
    min: 2,
    max: 15,
  },
  hour: {
    type: String,
  },
});
