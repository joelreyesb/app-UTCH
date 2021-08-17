const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const app = express();
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const User = require("./user");
const { find } = require("./user");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, "public")));

const mongo_uri = "mongodb://127.0.0.1:27017/users";

mongoose.connect(mongo_uri, function (err) {
  if (err) {
    throw err;
  } else {
    console.log(`Successfuly connected to ${mongo_uri}`);
  }
});

app.get('/index')

app.post("/register", (req, res) => {
  const { username, password } = req.body;

  const user = new User({ username, password });

  user.save((err) => {
    if (err) {
      res.status(500).send("ERROR: error when registering user");
    } else {
      res.status(200).send("User Succesfully registered");
    }
  });
});

app.post("/authenticate", (req, res) => {
  const { username, password } = req.body;

  User.findOne({username}, (err, user) => {
    if (err) {
      res.status(500).send("ERROR: error when authenticating user");
    } else if (!user) {
      res.status(500).send("ERROR: the user doesn't exists");
    } else {
      user.isCorrectPassword(password, (err, result) => {
        if (err) {
          res.status(500).send("ERROR: error when authenticating user");
        } else if (result) {
          res.status(200).send("User autenticated successfully");
        } else {
          res.status(500).send("ERROR: wrong user or password");
        }
      });
    }
  });
});

app.listen(3100, () => {
  console.log("Server started");
});

module.exports.app;
