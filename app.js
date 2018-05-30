const express = require("express");
const exphbs = require("express-handlebars");
const mongoose = require("mongoose");
const app = express();

// connect to mongoose
mongoose.connect("mongodb://bipin:bipin1@ds241530.mlab.com:41530/vidjot")
.then(() => console.log("mongodb/mlab connected"))
.catch(err => console.log("Error on connecting mongodb/mlab", err));

// handlebars middleware
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// index route
app.get("/", (req, res) => {
	const title = "Welcome "
	res.render("index", { title: title });
});

// about route
app.get("/about", (req, res) => {
	res.render("about");
});

// handle unknown route
app.get("/*", (req, res) => {
	res.status(400).send("404 URL is not recognized");
});


const port = process.env.port || 3000;
app.listen(port, () => {
	console.log(`server is running on port: ${port}`);
});