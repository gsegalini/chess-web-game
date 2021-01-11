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
let server = http.createServer(app);

app.get("/game", indexRouter);

app.get("/splash", indexRouter);


var server = http.createServer(app);
const wss = new websocket.Server({ server });

var websockets = {}; //key:websocket.id, value:gameObject


setInterval(function() {
  for (let i in websockets) {
    if (Object.prototype.hasOwnProperty.call(websockets,i)) {
      let gameObj = websockets[i];
      //if the gameObj has a final status, the game is complete/aborted
      if (gameObj.status === "B-WIN" || gameObj.status === "W-WIN") {
        delete websockets[i];
      }
    }
  }
}, 50000);

let startedGames = 0;
let currentGame = new gameObject(startedGames++);   //startedGames will come from the stats tracker
let socketID = 0;

wss.on("connection", function connection(ws) {
  /*
   * two-player game: every two players are added to the same game
   */
  let con = ws;
  con.id = socketID++;
  let playerType = currentGame.addPlayer(con);
  websockets[con.id] = currentGame;

  console.log(
    "Player %s placed in game %s as %s",
    con.id,
    currentGame.id,
    playerType
  );

  /*
   * inform the client about its assigned player type
   */
  con.send(playerType == "white" ? messages.S_PLAYER_WHITE : messages.S_PLAYER_BLACK);


  /*
   * once we have two players, there is no way back;
   * a new game object is created;
   * if a player now leaves, the game is aborted (player is not preplaced)
   */
  if (currentGame.p1websocket != "placeholder" && currentGame.p2websocket != "placeholder") {
    currentGame = new Game(gamesInitialized++);
  }

  /*
   * message coming in from a player:
   *  1. determine the game object
   *  2. determine the opposing player OP
   *  3. send the message to OP
   */
  con.on("message", function incoming(message) {
    let oMsg = JSON.parse(message);

    let gameObj = websockets[con.id];
    let isWhite = gameObj.p1websocket == con ? true : false;
    /**
     * check if it is correct guy turn, receive move and check if it is valid, if it is update gameBoard
     */
    
  });

  con.on("close", function(code) {
    /*
     * code 1001 means almost always closing initiated by the client;
     * source: https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent
     */
    console.log(con.id + " disconnected ...");

    if (code == "1001") {
      /*
       * if possible, abort the game; if not, the game is already completed
       */
      let gameObj = websockets[con.id];

      if (gameObj.isValidTransition(gameObj.gameState, "ABORTED")) {
        gameObj.setStatus("ABORTED");
        gameStatus.gamesAborted++;

        /*
         * determine whose connection remains open;
         * close it
         */
        try {
          gameObj.p1websocket.close();
          gameObj.p1websocket = "placeholder";
        } catch (e) {
          console.log("White closing: " + e);
        }

        try {
          gameObj.p2websocket.close();
          gameObj.p1websocket = "placeholder";
        } catch (e) {
          console.log("Black closing: " + e);
        }
      }
    }
  });
});


server.listen(port);