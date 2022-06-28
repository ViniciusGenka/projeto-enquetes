require("dotenv").config();
const express = require("express");
const helmet = require("helmet");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(helmet());

const cookieParser = require("cookie-parser");
app.use(cookieParser());

const mongoose = require("mongoose");
mongoose.connect(process.env.DATABASE_URL);
const db = mongoose.connection;
db.on("error", (err) => console.error(err));
db.on("open", () => console.log("Connected to database"));

const authenticationRouter = require("./src/routes/authentication");
app.use("/auth", authenticationRouter);

app.listen(4000, () => {
  console.log("Authentication server has started");
});
