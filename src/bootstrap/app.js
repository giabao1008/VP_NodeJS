const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const session = require("express-session");

app.use(
  session({
    secret: "vietpro-secret",
  })
);

require("../libs/mongo-db");

app.use(require("../apps/middlewares/share-data"));

app.use("/assets", express.static(path.join(__dirname, "..", "public")));

//Using body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Using template engine
app.set("views", path.join(__dirname, "..", "apps", "views"));
app.set("view engine", "ejs");

// app.use("/api", require("../routers/api"));
app.use("/", require("../routers/web"));

module.exports = app;
