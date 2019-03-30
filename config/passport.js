const localStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')

// load user model
const User = require('../models/User')

module.exports = function(passport) {
	passport.use(
		new localStrategy(
			// by default, local strategy uses username and password, we will override with email
			{
				usernameField: 'email',
				// allows us to pass back the entire request to the callback,
				// here used to access flash message
				passReqToCallback: true
			},
			(req, email, password, done) => {
				User.findOne({ email: email })
					.then(user => {
						if (!user) {
							return done(null, false, req.flash('error_msg', 'No user found'))
						}

						// match password
						bcrypt.compare(password, user.password, (err, isMatch) => {
							if (err) throw err
							if (isMatch) {
								return done(null, user, req.flash('success_msg', 'You are logged in'))
							} else {
								return done(null, false, req.flash('error_msg', 'password incorrect'))
							}
						})
					})
					.catch(err => console.log('localStrategy: Something gone wrong', err))
			}
		)
	)

	passport.serializeUser((user, done) => {
		done(null, user.id)
	})

	passport.deserializeUser((id, done) => {
		User.findById(id, (err, user) => {
			done(err, user)
		})
	})
}
