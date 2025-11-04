const express = require("express");
const app = express();

const methodOverride = require("method-override");
app.use(methodOverride("_method"));

const path = require("node:path");
app.use(express.static(path.join(__dirname, "views")));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

module.exports = app;
