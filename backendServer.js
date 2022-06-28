require("dotenv").config();
const helmet = require("helmet");

const express = require("express");
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
db.once("open", () => console.log("Connected to database"));

const enqueteRouter = require("./src/routes/enquetes");
app.use("/enquete", enqueteRouter);

const userRouter = require("./src/routes/users");
app.use("/user", userRouter);

app.listen(3000, () => console.log("Main Server has Started"));
