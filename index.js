const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const main = require("./routes/main");
const opn = require("open");
const { google } = require("googleapis");
const app = express();
const PORT = 1234;

require("dotenv").config();
const clientID =
  "873087145391-m9e0ldgdol7a097a9klcsfhj7pir03l5.apps.googleusercontent.com";
const clientSECRET = "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";
const redirectURL = "http://localhost:1234/oauth2callback";
const oauth2Client = new google.auth.OAuth2(
  clientID,
  clientSECRET,
  redirectURL
);
app.get("/", (req, res) => {
  console.log(req.params);
  res.send("Hello World!");
});
google.options({ auth: oauth2Client });
//url for consent page
const url = oauth2Client.generateAuthUrl({
  // 'online' (default) or 'offline' (gets refresh_token)
  access_type: "offline",

  // If you only need one scope you can pass it as a string
  scope: "https://www.googleapis.com/auth/calendar",
});
opn(url, { wait: false });
app.get("/oauth2callback", async (req, res) => {
  const code = req.query.code;
  console.log(code);
  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);
  const calendar = google.calendar({ version: "v3" });
  // const event = {
  //   summary: "Appointment",
  //   location: "Somewhere",
  //   start: {
  //     dateTime: new Date(),
  //     timeZone: "America/Los_Angeles",
  //   },
  //   end: {
  //     dateTime: new Date(new Date().getTime() + 60 * 60 * 1000),
  //     timeZone: "America/Los_Angeles",
  //   },
  // };

  // calendar.events.insert(
  //   { calendarId: "primary", resource: event },
  //   (err, event) => {
  //     if (err) return console.log("The API returned an error: " + err);
  //     console.log(`Event created: ${event.data.htmlLink}`);
  //   }
  // );
  calendar.events.list({ calendarId: "primary" }, (err, res) => {
    if (err) res.send(err);
    const events = res.data.items;
    if (events.length) {
      console.log(events);
    }
  });

  res.end("whats that");
});

app.use("/main", main);

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

// client id: 873087145391-m9e0ldgdol7a097a9klcsfhj7pir03l5.apps.googleusercontent.com
// client secret : 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
