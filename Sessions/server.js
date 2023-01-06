const express = require("express");
const app = express();
require("dotenv").config();
const session = require("express-session");
// const cookieParser = require("cookie-parser");
const ConnectToMongo = require("./src/Routes/connectDB");
const port = process.env.PORT || 5000;

ConnectToMongo();
app.use(express.json());
// app.use(cookieParser());
app.use(
  session({
    key: "user_sid",
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 500000,
    },
  })
);

app.use("/auth", require("./src/Routes/auth"));

app.listen(port, () => {
  console.log(`Now listening on port ${port}`);
});
