require("dotenv").config();
const jwt = require("jsonwebtoken");
const express = require("express");
const router = express.Router();
const { User } = require("./../models");

const generateAccesToken = (user) => {
  return jwt.sign(user, process.env.SECRET, { expiresIn: "5m" });
};

const validateToken = (req, res, next) => {
  const accessToken = req.headers["authorization"] || req.body.token;
  if (!accessToken) {
    res.send("Access denied");
  }
  jwt.verify(accessToken, process.env.SECRET, (err, user) => {
    if (err) {
      res.send("Access denied, token expired o incorrect");
    } else {
      next();
    }
  });
};

router.get("/", validateToken, (req, res) => {
  User.find({})
    .then((products) => {
      res.send(products);
    })
    .catch((err) => {
      res.send(err)
    });
});

router.get("/:mail", (req, res) => {
  User.findOne({ mail: req.params.mail })
    .then((products) => {
      res.send(products);
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post("/", (req, res) => {
  const user = {
    name: req.body.name,
    password: req.body.password,
    mail: req.body.mail,
  };
  console.log(user);

  const haveUser = User.findOne({ mail: req.body.mail });

  if (!haveUser) {
    User.create(user)
      .then((user) => {
        res.send(user);
      })
      .catch((err) => console.log(err));
  } else {
    res.status(500).json({
      message: "Err",
    });
  }
});

router.post("/auth", (req, res) => {
  const { name, password } = req.body;

  const user = { username: name };

  const accessToken = generateAccesToken(user);

  res.header("authorization", accessToken).json({
    message: "User autenticado",
    token: accessToken,
  });
});

module.exports = router;
