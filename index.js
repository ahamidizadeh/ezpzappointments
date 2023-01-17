const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const app = express();
const PORT = 3000;

require("dotenv").config();

app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.listen(PORT, () => console.log("listening on port: ", PORT));

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.set("strictQuery", false);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("Connected to MongoDB!");
});
