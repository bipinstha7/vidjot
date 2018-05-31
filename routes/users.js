const express = require("express");
const router = express.Router();

// user login route
router.get("/users/login", (req, res) => {
  res.render("users/login");
});

// user register route
router.get("/users/register", (req, res) => {
  res.render("users/register");
});

module.exports = router;