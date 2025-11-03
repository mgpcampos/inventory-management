const express = require("express");
const app = express();

const methodOverride = require("method-override");
app.use(methodOverride("_method"));

const path = require("node:path");
app.use(express.static(path.join(__dirname, "views")));

// Configurando middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

module.exports = app;
