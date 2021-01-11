/**
 * Various imports required
 */

var express = require("express");
var http = require("http");
var indexRouter = require("./routes/index");
var gameObject = require("./gameObject");


var port = process.argv[2];
var app = express();
var websockets = {};
app.use(express.static(__dirname + "/public"));
http.createServer(app).listen(port);

app.get("/game", indexRouter);

app.get("/splash", indexRouter);