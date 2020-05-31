// ************************************************************
// Importing Modules
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyparser = require("body-parser");
const methodOverride = require("method-override");

// ************************************************************
// Inititalizing Modules
app.use(express.static("public"));
app.use(bodyparser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
// ************************************************************
// Connecting to Database
mongoose.connect(
  "mongodb+srv://user:XjVBg3clW5NUTJ3Q@genericdatabase-odlqy.mongodb.net/testing?authSource=admin&replicaSet=genericdatabase-shard-0&w=majority&readPreference=primary&appname=MongoDB%20Compass%20Community&retryWrites=true&ssl=true",
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => console.log("Connected to Database")
);
// ************************************************************

// ************************************************************
// MiddelWares
app.use(express.json());
// ************************************************************

// ************************************************************
// Importing Routes
const authRoute = require("./routes/auth");
const privateRoute = require("./routes/privateRoutes");
// ************************************************************

// ************************************************************
// Routes
app.use("/dsc/user", authRoute);
app.use("/dsc/posts", privateRoute);

app.get("/", (req, res) => {
  res.render("index.ejs");
});
app.get("/login", (req, res) => {
  res.render("login.ejs");
});
app.get("/register", (req, res) => {
  res.render("register.ejs");
});
// ************************************************************

// ************************************************************
// Staring the Server

app.listen(process.env.PORT || 3000, function () {
  console.log("SERVER STARTED");
});

// ************************************************************
