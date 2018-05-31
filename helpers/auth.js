// prevent unauthorized user to access data
module.exports = {
  ensureAuthenticated: function (req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash("error_msg", "Not Authorized: You need to be logged in first");
    res.redirect("/users/login");
  },

  // prevent logged in users to enter in login and logout page
  isLoggedinAlready: function (req, res, next) {
    if (req.isAuthenticated()) {
      req.flash("success_msg", "You are already logged in");
      res.redirect("back");
    } else {
        next();
    }
  }
}


