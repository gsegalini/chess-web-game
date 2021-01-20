/**
 * Various imports required
 */

var express = require("express");
var http = require("http");
var indexRouter = require("./routes/index");
var messages = require("./public/javascripts/messages");
var websocket = require("ws");
var websocketFunction = require("./websocketsFunctionsServer");
var gameStats = require("./gamestats");
var gameObject = require("./gameObject");

var port = process.argv[2];
var app = express();
app.use(express.static(__dirname + "/public"));
let server = http.createServer(app);

app.set('view engine', 'ejs')

app.get("/game", indexRouter);

app.get('/', function (req, res) {
  var ingame = gameStats.totalPlayer - gameStats.playerWaiting;
  var onlinePlayers = gameStats.totalPlayer;
  res.render('splash.ejs', { online: onlinePlayers, ingame: ingame, waiting: gameStats.playerWaiting });
})
app.get('/*', function (req, res) {
  res.render('html_error.ejs', { message: "Error 404 File not Found", status: "File not found" });
})


const wss = new websocket.Server({ server });

var websockets = {}; //key:websocket.id, value:gameObject

let f = new websocketFunction();
/**
 * TODO create websockets helper functions, put them everywhere we need them.
 */
setInterval(function () {
  //console.table(gameStats);
  for (let i in websockets) {
    if (Object.prototype.hasOwnProperty.call(websockets, i)) {
      let gameObj = websockets[i];
      //if the gameObj has a final status, the game is complete/aborted
      if (gameObj.status === "B-WIN" || gameObj.status === "W-WIN" || gameObj.status == "ABORTED" || gameObj.status == "DRAW") {
        gameStats.totalPlayer -= gameObj.joined;
        //console.log(gameObj.joined);
        gameObj.joined = 0;
        delete websockets[i];
      }
    }
  }
}, 20000);

let currentGames = {"1min" : null, 
                    "1v1" : null, 
                    "5min" : null, 
                    "5v5" : null, 
                    "10min" : null, 
                    "10v10" : null,}

currentGames["1min"] = new gameObject(gameStats.startedGames++, 1, false);   //startedGames will come from the stats tracker
currentGames["1v1"] = new gameObject(gameStats.startedGames++, 1, true);
currentGames["5min"] = new gameObject(gameStats.startedGames++, 5, false);
currentGames["5v5"] = new gameObject(gameStats.startedGames++, 5, true);
currentGames["10min"] = new gameObject(gameStats.startedGames++, 10, false);
currentGames["10v10"] = new gameObject(gameStats.startedGames++, 10, true);

let socketID = 0;

wss.on("connection", function connection(ws, req, res) {


  /**
   * two-player game: every two players are added to the same game with same rules, so first check rules and then add to it
   */
  if (req.headers.cookie == undefined) {return;}
  let cookies = req.headers.cookie.split(";");
  let rules = "";
  for (var i = 0; i < cookies.length; i++) {
    if (cookies[i].startsWith("rules=")){rules = cookies[i].slice(6); break}
  }
  if (rules == "") {console.log("No rules cookie")};
  /**
   * get correct currentGame
   */
  gameStats.totalPlayer++;
  let currentGame = currentGames[rules];
  if (currentGame == undefined) return; //shit happened
  
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
  gameStats.playerWaiting++;
  currentGame.joined++;
  /*
   * once we have two players, there is no way back;
   * a new game object is created;
   * if a player now leaves, the game is aborted (player is not preplaced)
   */
  if (currentGame.whiteWebSocket != "placeholder" && currentGame.blackWebSocket != "placeholder") {
    currentGame.setStatus("STARTED");
    f.sendStart(currentGame.whiteWebSocket);
    f.sendStart(currentGame.blackWebSocket);
    f.sendTimer(currentGame.whiteWebSocket, "black", currentGame.times["black"]);
    f.sendTimer(currentGame.blackWebSocket, "black", currentGame.times["black"]); //send black separately as it isn't send until its turn

    currentGame.timer = setInterval(function(game){
      if (game.whiteWebSocket == "placeholder" || game.blackWebSocket == "placeholder") return;
      game.times[game.turn]--;
      f.sendTimer(game.whiteWebSocket, game.turn, game.times[game.turn]);
      f.sendTimer(game.blackWebSocket, game.turn, game.times[game.turn]);
    }, 1000, currentGame);

    
    if (rules == "1min") currentGames["1min"] = new gameObject(gameStats.startedGames++, 1, false);   //startedGames will come from the stats tracker
    else if (rules == "1v1") currentGames["1v1"] = new gameObject(gameStats.startedGames++, 1, true);
    else if (rules == "5min") currentGames["5min"] = new gameObject(gameStats.startedGames++, 5, false);
    else if (rules == "5v5") currentGames["5v5"] = new gameObject(gameStats.startedGames++, 5, true);
    else if (rules == "10min") currentGames["10min"] = new gameObject(gameStats.startedGames++, 10, false);
    else if (rules == "10v10") currentGames["10v10"] = new gameObject(gameStats.startedGames++, 10, true);
    gameStats.playerWaiting -= 2;
  }

  /*
   * message coming in from a player:
   *  1. determine the game object
   *  2. determine the 2 players
   *  3. send the message to player[s]
   */
  con.on("message", function incoming(message) {
    let oMsg = JSON.parse(message);
    let gameObj = websockets[con.id];
    let isWhite = gameObj.whiteWebSocket == con ? true : false;
    //switch case for types of messages

    console.log(oMsg);
    switch (oMsg.type) {
      case messages.T_OFFER_DRAW:
        if (gameObj.status == "WAITING") break;
        if (isWhite) {
          f.sendDraw(gameObj.blackWebSocket);
        }
        else {
          f.sendDraw(gameObj.whiteWebSocket);
        }
        break;

      case messages.T_ACCEPT_DRAW:
        if (gameObj.status == "WAITING") break;
        f.sendResult(gameObj.blackWebSocket, "DRAW");
        f.sendResult(gameObj.whiteWebSocket, "DRAW");
        gameObj.setStatus("DRAW");  
        break;
      case messages.T_RESIGN:
        if (gameObj.status == "WAITING") break;
        if (isWhite) {
          f.sendResult(gameObj.blackWebSocket, "WIN");
          f.sendResult(gameObj.whiteWebSocket, "LOSS");
          gameObj.setStatus("B-WIN");
        }
        else {
          f.sendResult(gameObj.blackWebSocket, "LOSS");
          f.sendResult(gameObj.whiteWebSocket, "WIN");
          gameObj.setStatus("W-WIN");
        }
        break;

      case messages.T_POSSIBLE_MOVE:
        if (gameObj.status == "WAITING") break;
        //check if it is correct guy turn, receive move and check if it is valid, if it is update gameBoard
        if (isWhite && gameObj.turn === "white" || !isWhite && gameObj.turn === "black") {
          let start = oMsg.data[0]; //starting piece place
          let end = oMsg.data[1]; // ending piece place
          //check he is moving own color
          if ((gameObj.boardObj.getPiece(start).color == "white") != isWhite) {
            console.log("moving opponent piece");
            f.sendReject(con);
            break; 
          }

          if (gameObj.validateMove(start, end)) {
            gameObj.movePiece(start, end);
            f.sendConfirmedMove(gameObj.whiteWebSocket, start, end);
            f.sendConfirmedMove(gameObj.blackWebSocket, start, end);
            if (isWhite && gameObj.isV) gameObj.times["white"]+=gameObj.time;
            if (!isWhite && gameObj.isV) gameObj.times["black"]+=gameObj.time;
            f.sendTimer(gameObj.whiteWebSocket, gameObj.turn, gameObj.times[gameObj.turn])
            gameObj.changeTurn();
            if (gameObj.checkWin() == "black") {
              f.sendResult(gameObj.blackWebSocket, "WIN");
              f.sendResult(gameObj.whiteWebSocket, "LOSS");
              gameObj.setStatus("W-WIN");
            }
            else if (gameObj.checkWin() == "white") {
              f.sendResult(gameObj.blackWebSocket, "LOSS");
              f.sendResult(gameObj.whiteWebSocket, "WIN");
              gameObj.setStatus("B-WIN");
            }
          }
          else {
            console.log("An invalid move was sent");
            f.sendReject(con);
          }
        }
        else {
          console.log("Wrong turn");
        }
        break;

      case messages.T_GAME_ABORT:
        if (gameObj.whiteWebSocket != "placeholder") f.abortGame(gameObj.whiteWebSocket);
        if (gameObj.blackWebSocket != "placeholder") f.abortGame(gameObj.blackWebSocket);
        gameObj.setStatus("ABORTED");
        console.log("game aborted");
        break;

    }




  });

  con.on("close", function (code) {
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
      if (gameObj == undefined) return;

      //gameStats.onlinePlayers--;
      /*
        * determine whose connection remains open;
        * close it
        */
      if (gameObj.joined > 1 && gameObj.status != "W-WIN" && gameObj.status != "B-WIN"){
        if (con == gameObj.whiteWebSocket){
          f.sendResult(gameObj.blackWebSocket, "WIN");
          //f.sendResult(gameObj.whiteWebSocket, "LOSS");
        }
        else{
          //f.sendResult(gameObj.blackWebSocket, "LOSS");
          f.sendResult(gameObj.whiteWebSocket, "WIN");
        } 
      }
      if (gameObj.status == "WAITING") gameStats.playerWaiting--;
      gameObj.joined--;
      gameStats.totalPlayer--;
      gameObj.status = "ABORTED";
      try {
        gameObj.whiteWebSocket.close();
        gameObj.whiteWebSocket = "placeholder";
      } catch (e) {
        console.log("White closing: " + e);
      }

      try {
        gameObj.blackWebSocket.close();
        gameObj.whiteWebSocket = "placeholder";
      } catch (e) {
        console.log("Black closing: " + e);
      }

    }
  });
});


server.listen(port);