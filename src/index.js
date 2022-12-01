const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const auth = require("./routes/auth.js");
const profile = require("./routes/profile.js");
const articles = require("./routes/articles.js");
const following = require("./routes/following.js");
// const cors = require("cors");
// const corsOptions = {origin: "http://localhost:3000", credentials: true};

const hello = (req, res) => res.send({ hello: "world" });

const app = express();

app.all("*", function (req, res, next) {
  res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type,Content-Length, Authorization,Origin,Accept,X-Requested-With"
  );
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.header("Access-Control-Allow-Credentials", true);
  res.header("X-Powered-By", " 3.2.1");
  res.header("Content-Type", "application/json;charset=utf-8");
  if (req.method === "OPTIONS") {
    res.sendStatus(200);
  } else {
    next();
  }
});
// app.use(cors(corsOptions));

app.use(bodyParser.json());
app.use(cookieParser());
app.get("/", hello);

auth(app);

profile(app);
articles(app);
following(app);

// Get the port from the environment, i.e., Heroku sets it
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  const addr = server.address();
  console.log(`Server listening at http://${addr.address}:${addr.port}`);
});
