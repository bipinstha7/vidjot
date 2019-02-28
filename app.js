const express = require('express')
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')
const app = express()
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const session = require('express-session')
const flash = require('connect-flash')
const passport = require('passport')

// load ideas routes
const ideas = require('./routes/ideas')
// load users routes
const users = require('./routes/users')
// passport config
require('./config/passport')(passport)

// connect to mongoose
mongoose
	.connect('mongodb://bipin:bipin1@ds241530.mlab.com:41530/vidjot')
	.then(() => console.log('mongodb/mlab connected'))
	.catch(err => console.log('Error on connecting mongodb/mlab', err))

//**********************************************
// 	 MIDDLEWARES start
//**********************************************

// handlebars middleware
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

// body parser middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

// method-override middleware
app.use(methodOverride('_method'))

// express-session middleware
app.use(
	session({
		secret: 'secret session',
		resave: true,
		saveUninitialized: true
	})
)

// passport middleware
app.use(passport.initialize())
app.use(passport.session())

// connect-flash middleware
app.use(flash())

// Global variables
app.use((req, res, next) => {
	res.locals.success_msg = req.flash('success_msg')
	res.locals.error_msg = req.flash('error_msg')
	res.locals.error = req.flash('error')
	// if user is logged in req.user has data otherwise it is null
	res.locals.currentUser = req.user || null
	next()
})

// static folder
app.use(express.static(__dirname + '/public'))

//**********************************************
// 	 MIDDLEWARES end
//**********************************************

// index route
app.get('/', (req, res) => {
	const title = 'Welcome '
	res.render('index', { title: title })
})

// about route
app.get('/about', (req, res) => {
	res.render('about')
})

// use ideas routes
app.use(ideas)
// app.use("/ideas",ideas);

// use users routes
app.use(users)
// app.use("/users",users);

// handle unknown route
app.get('/*', (req, res) => {
	res.status(400).send('404 URL is not recognized')
})

const port = process.env.PORT || 3000
app.listen(port, () => {
	console.log(`server is running on port: ${port}`)
})
