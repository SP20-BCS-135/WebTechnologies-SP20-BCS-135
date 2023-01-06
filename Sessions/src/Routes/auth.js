const express = require("express");
const router = express.Router();
const Joi = require("joi");

router.get("/login", (req, res) => {
  console.log(Joi);
  res.send("umair")
});

module.exports = router;
