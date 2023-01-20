const router = require("express").Router();
const { google } = require("googleapis");

router.get("/", (req, res) => {});
router.get("/send", async (req, res) => {
  const oauth2Client = new google.auth.OAuth2(
    "873087145391 - m9e0ldgdol7a097a9klcsfhj7pir03l5.apps.googleusercontent.com",
    "GOCSPX - PTqGzn1Y1fTvmHMkBV_tpW97a3 - u"
  );
  console.log(oauth2Client.credentials);
});
module.exports = router;
