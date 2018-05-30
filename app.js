const express = require("express");
const exphbs = require("express-handlebars");
const mongoose = require("mongoose");
const app = express();
const bodyParser = require("body-parser");

// load Idea model
const Idea = require("./models/Idea");

// connect to mongoose
mongoose.connect("mongodb://bipin:bipin1@ds241530.mlab.com:41530/vidjot")
	.then(() => console.log("mongodb/mlab connected"))
	.catch(err => console.log("Error on connecting mongodb/mlab", err));

//**********************************************
// 	 MIDDLEWARES start
//**********************************************

// handlebars middleware
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// body parser middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

//**********************************************
// 	 MIDDLEWARES end
//**********************************************


// index route
app.get("/", (req, res) => {
	const title = "Welcome "
	res.render("index", { title: title });
});

// about route
app.get("/about", (req, res) => {
	res.render("about");
});

// add idea form
app.get("/ideas/add", (req, res) => {
	res.render("ideas/add");
});

// process form 
app.post("/ideas", (req, res) => {
	let errors = [];
	if (!req.body.title) {
		errors.push({ textTitle: "Please add a title" });
	}
	if (!req.body.details) {
		errors.push({ textDetails: "Please add some details" });
	}
	if (errors.length > 0) {
		res.render("ideas/add", {
			errors: errors,
			title: req.body.title,
			details: req.body.details
		});
	} else {
		const newUser = {
			title: req.body.title,
			details: req.body.details
		}
		Idea.create(newUser)
		.then(idea => {
			res.redirect("/ideas");
		})
		.catch(err => console.log("post: /ideas-", err));
	}
});

// handle unknown route
app.get("/*", (req, res) => {
	res.status(400).send("404 URL is not recognized");
});

const port = process.env.port || 3000;
app.listen(port, () => {
	console.log(`server is running on port: ${port}`);
});