const express = require("express");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const router = express.Router();

// load user model
const User = require("../models/User");

// user login route
router.get("/users/login", (req, res) => {
  res.render("users/login");
});

// POST login form 
router.post("/users", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/ideas",
    failureRedirect: "/users/login",
    failureFlash: true
  })(req, res, next);
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

  if(req.body.password.length < 5) {
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
    User.findOne({email: req.body.email})
      .then(user => {
        if(user) {
          req.flash("error_msg","Email already registered");
          res.redirect("/users/register");
        } else {
            const newUser = {
              name: req.body.name,
              email: req.body.email,
              password: req.body.password,
            }
            bcrypt.genSalt(10, (err, salt) => {
              bcrypt.hash(newUser.password, salt, (err, hash) =>{
                if(err) throw error;
                newUser.password = hash;
                
                User.create(newUser)
                  .then(user => {
                    req.flash("success_msg", "You are now registerd and can log in");
                    res.redirect("/users/login");
                    console.log(newUser.password);
                  })
                  .catch(err => {
                    res.status(500).send(err);
                    console.log("POST: /users/register-", err);
                  });
              });
            }); 
          }
      });
  }
});

// logout user route
router.get("/users/logout", (req, res) => {
  req.logout();
  req.flash("success_msg", "You are logged out");
  res.redirect("/users/login");
});

module.exports = router;