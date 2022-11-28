require("dotenv").config();
const bcrypt = require("bcrypt");
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
      res.send(err);
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

router.post("/singin", async (req, res) => {
  const { name, password, mail } = req.body;

  const haveUser = await User.findOne({ mail });
  console.log(haveUser);

  const saltRounds = 10;

  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = {
    name,
    passwordHash,
    mail,
  };
  if (!haveUser) {
    User.create(user)
      .then((user) => {
        res.status(201).send(user);
      })
      .catch((err) => console.log(err));
  } else {
    res.status(500).send({
      message: "This email have acount",
    });
  }
});

router.post("/login", async (req, res) => {
  const { password, mail } = req.body;
  console.log(mail);

  const haveUser = await User.findOne({ mail });

  console.log(haveUser);

  const passswordCorrect =
    haveUser === null
      ? false
      : await bcrypt.compare(password, haveUser.passwordHash);

  if (!(haveUser && passswordCorrect)) {
    res.status(500).send({
      message: "invalid user or password",
    });
  } else {
    const user = { mail, id: haveUser._id, name: haveUser.name };

    const accessToken = generateAccesToken(user);

    res.header("authorization", accessToken).send({
      message: "User autenticado",
      token: accessToken,
    });
  }
});

module.exports = router;
