require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const createError = require("http-errors");
const helmet = require("helmet");
const xss = require("xss-clean");

const app = express();

const mainRouter = require("./src/routes/index");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(morgan("dev"));

app.use(cors({ 
  origin: "*"
}));

app.use(helmet());
app.use(xss());

app.use("/api/v1", mainRouter);

app.use("/tmp", express.static("./tmp"));

app.all("*", (req, res, next) => {
  next(createError());
});

// console.log()

app.use((err, req, res, next) => {
  const statusCode = err.status;
  if (res.status(statusCode)) {
    res.send(createError(statusCode, err));
  }
  next();
});

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`server running on :${port}`);
});
