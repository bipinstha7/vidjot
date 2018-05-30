const express = require("express");
const exphbs = require("express-handlebars");
const mongoose = require("mongoose");
const app = express();
const bodyParser = require("body-parser");
const methodOverride = require("method-override");

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

// method-override middleware
app.use(methodOverride("_method"));

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

// idea index page
app.get("/ideas", (req, res) => {
	Idea.find({})
		.sort({ date: "desc" })
		.then(ideas => {
			res.render('ideas/index', { ideas: ideas });
		})
		.catch(err => {
			res.status(500).send(err);
			console.log("get: /ideas-", err)
		});
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
			.catch(err => {
				res.status(500).send(err);
				console.log("post: /ideas-", err)
			});
	}
});

// edit idea form
app.get("/ideas/edit/:id", (req, res) => {
	Idea.findById(req.params.id)
		.then(idea => {
			res.render("ideas/edit", { idea: idea });
		})
		.catch(error => {
			res.status(500).send(err);
			console.log("get: /ideas/edit/:id", err)});
});

// edit form process
app.put("/ideas/:id", (req, res) => {
	// const updateIdea = {
	// 	title: req.body.title,
	// 	details: req.body.details
	// };
	Idea.findByIdAndUpdate(req.params.id, req.body)
		.then(updateIdea => {
			res.redirect("/ideas");
		})
		.catch(err => {
			res.status(500).send(err);
			console.log("put: /ideas/:id-", err);
		});
});

// delete idea
app.delete("/ideas/:id", (req, res) => {
	Idea.findByIdAndRemove(req.params.id)
		.then(() => {
			res.redirect("/ideas");
		})
		.catch(err => {
			res.status(500).send(err);
			console.log("delete: /ideas/:id", err);
		});
});

// handle unknown route
app.get("/*", (req, res) => {
	res.status(400).send("404 URL is not recognized");
});

const port = process.env.port || 3000;
app.listen(port, () => {
	console.log(`server is running on port: ${port}`);
});