 const express = require("express");
const app = express();

// middleware
app.use((req, res, next) => {
    console.log((new Date).getFullYear());
    next();
});

// index route
app.get("/", (req, res) => {
    res.send("This is index/home route");
});

// about route
app.get("/about", (req, res) => {
    res.send("About Page");
});

// handle unknown route
app.get("/*", (req, res) => {
    res.status(400).send("404 URL is not recognized");
});


const port = process.env.port || 3000;
app.listen(port, () => {
    console.log(`server is running on port: ${port}`);
});