/**
 * Various imports required
 */

var express = require("express");
var http = require("http");
var indexRouter = require("./routes/index");
var messages = require("./public/javascripts/messages");
var websocket = require("ws");

var gameObject = require("./gameObject");

var port = process.argv[2];
var app = express();
app.use(express.static(__dirname + "/public"));
http.createServer(app).listen(port);

app.get("/game", indexRouter);

app.get("/splash", indexRouter);


var server = http.createServer(app);
const wss = new websocket.Server({ server });

var websockets = {}; //key:websocket, value:gameObject


setInterval(function() {
  for (let i in websockets) {
    if (Object.prototype.hasOwnProperty.call(websockets,i)) {
      let gameObj = websockets[i];
      //if the gameObj has a final status, the game is complete/aborted
      if (gameObj.finalStatus != null) {
        delete websockets[i];
      }
    }
  }
}, 50000);
