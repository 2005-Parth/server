const express = require("express");
const bodyParser = require("body-parser");
const router = require("./routes");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");

const app = express();

// Middleware for security
app.use(helmet());

// Middleware for logging HTTP requests
app.use(morgan("common"));

// Middleware for enabling CORS
app.use(cors());

// on req, print the method and url

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  console.log(req.body);
  next();
});

app.use((req, res, next) => {
  console.log(res.statusCode);
  console.log(res.statusMessage);
  console.log(res.body);
  next();
});

// Middleware for parsing JSON and URL-encoded data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Use the routes
app.use("/api/v1", router);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

module.exports = app;
