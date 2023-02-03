const mongoose = require("mongoose");

const tokenSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true,
  },
  access_token: {
    type: String,
    required: true,
  },
  refresh_token: {
    type: String,
    require: true,
  },
  expires_at: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("Token", tokenSchema);
