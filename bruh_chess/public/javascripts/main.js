/* eslint-disable no-unused-vars */

/**
 * TODO find a way to connect a function sending websockets messages to the pieces images
 * Idea of implementing squares where king is checked: make seperate board which contains locations, which the king can move to
 * 
 */

const moveAudio = new Audio("./files/move.mp3");
const captureAudio = new Audio("./files/capture.wav");
const url = "ws://" + location.host;


// Setup
window.addEventListener('load', function () {

  // Cookie validator
  if (document.cookie.indexOf("rules=") < 0) {
    alert("Rules cookie not found, redirecting you.");
    location.href = "../";
  }
  else {
    let cookie = getCookie("rules");
    let valids = ["1min", "1v1", "5min", "5v5", "10min", "10v10", "bruh"];
    if (!(valids.includes(cookie))) {
      alert("Rules cookie has wrong format, redirecting you");
      location.href = "../";
    }
  }

  const socket = new WebSocket(url);
  let activeMatch;

  // Set option listeners
  const premoves = document.getElementById("premoves");
  const clicks = document.getElementById("clicks");
  const sound = document.getElementById("sound");
  premoves.addEventListener("change", changePremove);
  clicks.addEventListener("change", changeClick);
  sound.addEventListener("change", changeSound);

  // Set draw listeners
  const drawYes = document.getElementById("draw-button-yes");
  const drawNo = document.getElementById("draw-button-no");
  drawYes.addEventListener("click", function () { sendAcceptDraw(socket) })
  drawNo.addEventListener("click", function () { document.getElementById("askForDraw").classList.toggle("show"); })


  // Options set
  const optionsSet = JSON.parse(window.localStorage.getItem('optionsGame'));
  if (optionsSet != null) {
    options.sound = optionsSet.sound;
    options.premove = optionsSet.premove;
    options.clickMove = optionsSet.clickMove;

    premoves.checked = optionsSet.premove;
    clicks.checked = optionsSet.clickMove;
    sound.checked = optionsSet.sound;
  }

  // fixes firefox drag issue
  document.addEventListener('dragstart', function (e) {
    e.preventDefault();
  });

  const myTimer = document.getElementById("myTimer");
  const enemyTimer = document.getElementById("enemyTimer");
  const resign = document.getElementById("resign");
  const draws = document.getElementById("draw");

  socket.onmessage = function (event) {
    const msg = JSON.parse(event.data);
    // if (msg.type != "UPDATE-TIMER") console.log(msg);
    switch (msg.type) {

      case "START":
        document.getElementById("end-screen").classList.toggle("show")
        activeMatch.myMove = (activeMatch.myColor == "white");
        break;

      case "PLAYER-COLOR":
        document.getElementById("end-screen").classList.toggle("show")
        document.getElementById("end-title").innerHTML = "Waiting for opponent";
        document.getElementById("go-to-splash").innerHTML = "Go back";

        document.getElementById("go-to-splash").addEventListener("click", function () {
          location.href = "/";
        }, true)

        resign.addEventListener("click", () => sendResign(socket));
        draws.addEventListener("click", () => sendDraw(socket));

        activeMatch = new Match(msg.data, socket);
        renderGameStart(activeMatch);
        break;

      case "CONFIRMED-MOVE":
        activeMatch.currentMove++;
        const whoMoved = didEnemyMove(msg.data[0], activeMatch);
        if (whoMoved) {
          activeMatch.premovePossible = true;
          activeMatch.myMove = true;
          renderEnemyMove(msg.data[0], msg.data[1], activeMatch);

          // Checks for premoves
          if (activeMatch.premoveQueue != null) {
            // Changes color from premove to regular
            document.querySelectorAll(".focused-premove").forEach(e => {
              e.classList.remove("focused-premove")
              e.classList.add("focused");
            });

            const piece = activeMatch.myDeadPieces.find((x) => {
              return x.name == activeMatch.premoveQueue.piece.name;
            });

            // If the piece is alive, move it.
            if (piece == undefined) {
              mouseUpFunHelper(activeMatch, activeMatch.premoveQueue.event, activeMatch.premoveQueue.htmlBoard, activeMatch.premoveQueue.htmlImage)
              renderBoardState(activeMatch);
              activeMatch.premoveQueue = null;
            }
          }
        }
        break;

      case "REJECTED-MOVE":
        let previous = activeMatch.moveHistory.slice(-1)[0];
        let start = previous.startPos;
        let end = previous.endPos;

        activeMatch.board[start[0]][start[1]] = previous.piece;
        previous.piece.position = start;
        activeMatch.board[end[0]][end[1]] = previous.endPiece;

        activeMatch.moveHistory.pop();
        renderBoardState(activeMatch);
        activeMatch.myMove = true;

        break;

      case "GAME-ABORTED":
        document.getElementById("end-screen").classList.toggle("show")
        document.getElementById("end-title").innerHTML = "Aborted";
        break;

      case "RESULT":
        const checkCondition = {
          WIN: "Victory bruhyale",
          LOSS: "2nd bruh",
          DRAW: "Bruh"
        }
        resign.disabled = true; 
        draws.disabled = true; 
        document.getElementById("end-screen").classList.toggle("show")
        document.getElementById("end-title").innerHTML = checkCondition[msg.data];
        break;

      case "OFFER-DRAW":
        document.getElementById("askForDraw").classList.toggle("show");
        // document.getElementById("askForDraw").classList.toggle("fade-out");
        break;

      case "UPDATE-TIMER":
        const color = msg.data[0];
        const time = msg.data[1];
        let seconds = time % 60 + "";
        let min = Math.floor(time / 60);
        if (time > 0) {
          if (seconds.length < 2) {
            seconds = "0" + seconds;
          }
        }
        else {
          min = "00";
          seconds = "00";
        }

        
        if (color == activeMatch.myColor) {
          myTimer.innerHTML = min + ":" + seconds;
        }
        else {
          enemyTimer.innerHTML = min + ":" + seconds;
        }

        if(activeMatch.myMove) {
          document.getElementById("enemyTimer").classList.remove("active-timer");
          document.getElementById("myTimer").classList.add("active-timer");
        } else {
          document.getElementById("enemyTimer").classList.add("active-timer");
          document.getElementById("myTimer").classList.remove("active-timer");
        }

        break;

      case "PROMOTION":
        const position = msg.data;
        activeMatch.promotePiece(position);
        renderBoardState(activeMatch);
        break;
      default:
        console.log("error?");
    }
  }
});



function Match(color, socket) {
  this.myColor = color;
  this.myPieces = [];
  this.opponentPieces = [];

  this.myDeadPieces = [];
  this.opponentDeadPieces = [];

  this.myMove = false;
  this.socket = socket;

  this.board = color == "white" ? createBoard(this.myPieces, this.opponentPieces) : createBoard(this.opponentPieces, this.myPieces);
  setupPieces(this.board);


  this.getPiece = function (coords) {
    return this.board[coords[0]][coords[1]];
  }

  this.moveHistory = [];
  this.currentMove = 0;

  this.tableIndex = 1;

  this.pieceHeld = "";
  this.pieceHTML = null;

  this.clickCounter = 0;
  this.premovePossible = true;
  this.premoveQueue = null;
  this.promotionCounter = 1;

  this.promotePiece = function (position) {
    const oldP = this.board[position[0]][position[1]];
    if (oldP.color == this.myColor) {
      const index = this.myPieces.indexOf(oldP);
      if (index > -1) {//remove from alive and add the queen
        this.myPieces.splice(index, 1);
        const name = "q" + this.myColor[0] + this.promotionCounter;
        this.promotionCounter++;
        this.board[position[0]][position[1]] = new queen(name, oldP.color, position);
        this.board[position[0]][position[1]].setBoard(this.board);
        this.myPieces.push(this.board[position[0]][position[1]]);
      }
    } else {
      const index = this.opponentPieces.indexOf(oldP);
      if (index > -1) {//remove from alive and add the queen
        this.opponentPieces.splice(index, 1);
        let opColor = this.myColor == "white" ? "b" : "w";
        const name = "q" + opColor + this.promotionCounter;
        this.promotionCounter++;
        this.board[position[0]][position[1]] = new queen(name, oldP.color, position);
        this.board[position[0]][position[1]].setBoard(this.board);
        this.opponentPieces.push(this.board[position[0]][position[1]]);
      }
    }
  }
}

