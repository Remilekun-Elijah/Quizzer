const express = require('express'),
    app = express(),
    morgan = require('morgan'),
    path = require('path'),
    consola = require('consola'),
    route = require(path.resolve("routes")),
    config = require("./config"),
    database = require("./database");

app.use(express.static(path.resolve(__dirname, '../public')));
app.set("view engine", "ejs");
app.set("views", path.resolve("views"));
app.use(express.json());
app.set('port', config.port);

const apiVersion = "/api/v1";
app.use(apiVersion,route);

const logger = {
    info: consola.info,
    error: consola.error,
    success: consola.success,
}

global.logger = logger;

if (app.get('env') === 'development') {
    app.use(morgan('dev'));
    require('dotenv').config();
}

database.connect(config.mongodb_uri)

module.exports = app;