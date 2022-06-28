const express = require("express");
const path = require("path");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "src/public")));
app.set("view engine", "ejs");

app.get("/user/login", (req, res) => {
  res.sendFile("./src/view/user/login.html");
});

app.listen(3001, () => {
  console.log("Frontend server listening on port 3001");
});
