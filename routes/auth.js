const router = require("express").Router();
const { google } = require("googleapis");
const { OAuth2Client } = require("google-auth-library");
const http = require("http");
const url = require("url");
const open = require("open");
const destroyer = require("server-destroy");
const Token = require("../models/Token.js");

router.get("/", async (req, res) => {
  async function main() {
    const oAuth2Client = await getAuthenticatedClient();

    oAuth2Client.on("tokens", (tokens) => {
      if (tokens.refresh_token) {
        // store the refresh_token in my database!
        Token.findOneAndUpdate(
          { user_id: "my token" },
          { $set: { refresh_token: tokens.refresh_token } },
          (err, token) => {
            if (err) throw err;
            console.log("Refresh token updated successfully!");
          }
        );
        console.log(tokens.refresh_token);
      }
      console.log(tokens.access_token);
    });

    google.options({
      auth: oAuth2Client,
    });
    const calendar = google.calendar({ version: "v3" });

    // Make a simple request to the People API using our pre-authenticated client. The `request()` method
    // takes an GaxiosOptions object.  Visit https://github.com/JustinBeckwith/gaxios.
    // const url = "https://people.googleapis.com/v1/people/me?personFields=names";
    // const res = await oAuth2Client.request({ url });
    // console.log(res.data);

    // // After acquiring an access_token, you may want to check on the audience, expiration,
    // // or original scopes requested.  You can do that with the `getTokenInfo` method.
    // const tokenInfo = await oAuth2Client.getTokenInfo(
    //   oAuth2Client.credentials.access_token
    // );
    // console.log("token info", tokenInfo);
  }
  function getAuthenticatedClient() {
    return new Promise((resolve, reject) => {
      // create an oAuth client to authorize the API call.  Secrets are kept in a `keys.json` file,
      // which should be downloaded from the Google Developers Console.
      const oAuth2Client = new OAuth2Client(
        process.env.CLIENT_ID,
        process.env.CLIENT_SECRET,
        process.env.REDIRECT_URL
      );

      // Generate the url that will be used for the consent dialog.
      const authorizeUrl = oAuth2Client.generateAuthUrl({
        access_type: "offline",
        scope: "https://www.googleapis.com/auth/calendar",
        prompt: "consent",
      });

      // Open an http server to accept the oauth callback. In this simple example, the
      // only request to our webserver is to /oauth2callback?code=<code>
      const server = http
        .createServer(async (req, res) => {
          try {
            if (req.url.indexOf("/oauth2callback") > -1) {
              // acquire the code from the querystring, and close the web server.
              const qs = new url.URL(req.url, "http://localhost:3333")
                .searchParams;
              const code = qs.get("code");
              console.log(`Code is ${code}`);
              res.end(
                "Authentication successful! Please return to the console."
              );
              server.destroy();

              // Now that we have the code, use that to acquire tokens.
              const r = await oAuth2Client.getToken(code);

              // Make sure to set the credentials on the OAuth2 client.
              oAuth2Client.setCredentials(r.tokens);

              //   const client = await google.getClient();
              //   console.log("client:", client);
              const tokens = new Token({
                user_id: "my token",
                access_token: r.tokens.access_token,
                refresh_token: r.tokens.refresh_token,
                expires_at: r.tokens.expiry_date,
              });
              tokens.save((err) => {
                if (err) throw err;
                console.log("saved the tokens!");
              });
              resolve(oAuth2Client);
            }
          } catch (e) {
            reject(e);
          }
        })
        .listen(3333, () => {
          // open the browser to the authorize url to start the workflow
          open(authorizeUrl, { wait: false }).then((cp) => cp.unref());
        });
      destroyer(server);
    });
  }
  main().catch(console.error);
});

router.post("/", async (req, res) => {});
module.exports = router;
