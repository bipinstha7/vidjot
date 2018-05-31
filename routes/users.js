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

// POST register route
router.post("/users/register", (req, res) => {
  let errors = [];

  if(req.body.password != req.body.password2) {
    errors.push({text: "Password do not match"});
  }

  if(req.body.password.length < 10) {
    errors.push({text: "Password must be at least 10 characters"});
  }

  if(errors.length > 0) {
    res.render("users/register",{
      errors: errors,
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      password2: req.body.password2
    });
  } else {
    res.send("success register");
  }
});

module.exports = router;