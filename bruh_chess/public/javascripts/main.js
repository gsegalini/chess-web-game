/* eslint-disable no-unused-vars */

/**
 * TODO find a way to connect a function sending websockets messages to the pieces images
 * Idea of implementing squares where king is checked: make seperate board which contains locations, which the king can move to
 * 
 
 */

let activeMatch;
const moveAudio = new Audio("./files/move.mp3");
const captureAudio = new Audio("./files/capture.wav");
var url = "ws://" + location.host;



// Setup
window.addEventListener('load', function () {
  if( document.cookie.indexOf("rules=") < 0) {
    alert("Rules cookie not found, redirecting you.");
    location.href = "../";
  }
  else{
    let cookie = getCookie("rules");
    let valids = ["1min", "1v1", "5min", "5v5", "10min", "10v10"];
    if (!(valids.includes(cookie))){
      alert("Rules cookie has wrong format, redirecting you");
    location.href = "../";
    }
  }

  const socket = new WebSocket(url);
  const resign = document.getElementById("resign");
  const draws = document.getElementById("draw");

  const premoves = document.getElementById("premoves");
  const clicks = document.getElementById("clicks");
  const sound = document.getElementById("sound");


  const myTimer = document.getElementById("myTimer");
  const enemyTimer = document.getElementById("enemyTimer");

  const drawYes = document.getElementById("draw-button-yes");
  const drawNo = document.getElementById("draw-button-no");

  // document.getElementById("askForDraw").classList.toggle("fade-out"); //we need to hide it as first thing

  drawYes.addEventListener("click", function(){sendAcceptDraw(socket)})
  drawNo.addEventListener("click", function(){
    // document.getElementById("askForDraw").classList.toggle("fade-out");
    document.getElementById("askForDraw").classList.toggle("show");
    })


  premoves.addEventListener("change", changePremove);
  clicks.addEventListener("change", changeClick);
  sound.addEventListener("change", changeSound);

    // Options set
  const optionsSet = JSON.parse(window.localStorage.getItem('optionsGame'));
    if(optionsSet != null) {
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


  socket.onmessage = function (event) {
    const msg = JSON.parse(event.data);
    
    switch (msg.type) {

      case "START":
        document.getElementById("end-screen").classList.toggle("show")

        
        
        
        activeMatch.myMove = (activeMatch.myColor == "white");
        break;

      case "PLAYER-COLOR":
        document.getElementById("end-screen").classList.toggle("show")
        document.getElementById("end-title").innerHTML="Waiting for opponent";
        document.getElementById("go-to-splash").innerHTML="Go back";
        document.getElementById("go-to-splash").addEventListener("click", function () {
          location.href = "/";
        }, true)

        resign.addEventListener("click", () => sendResign(socket));
        draws.addEventListener("click", () => sendDraw(socket));
        renderGameStart(msg, socket);
        break;

      case "CONFIRMED-MOVE":
        activeMatch.currentMove++;
        const whoMoved = didEnemyMove(msg.data[0], activeMatch);
        if (whoMoved) {
          activeMatch.premovePossible = true;
          activeMatch.myMove = true;
          renderEnemyMove(msg.data[0], msg.data[1], activeMatch);
          renderBoardState(activeMatch);
          if(activeMatch.premoveQueue != null) {
            document.querySelectorAll(".focused-premove").forEach(e => {
              e.classList.remove("focused-premove")
              e.classList.add("focused");
            });
            const piece = activeMatch.myDeadPieces.find((x) => {
              return x.name == activeMatch.premoveQueue.piece.name;
            });

            if(piece == undefined ){
              mouseUpFunHelper(activeMatch, activeMatch.premoveQueue.event, activeMatch.premoveQueue.htmlBoard, activeMatch.premoveQueue.htmlImage)
              renderBoardState(activeMatch);
              activeMatch.premoveQueue = null;
            }
            
          }

        }
        break;

      case "REJECTED-MOVE":
        let previous = activeMatch.moveHistory.slice(-1)[0];
        historyHelper(previous, activeMatch);
        activeMatch.moveHistory.pop();
        renderBoardState(activeMatch);
        activeMatch.myMove = true;
        
        break;

      case "GAME-ABORTED":
        document.getElementById("end-screen").classList.toggle("show")
        document.getElementById("end-title").innerHTML="Aborted";
        break;

      case "RESULT":
        document.getElementById("end-screen").classList.toggle("show")
        document.getElementById("end-title").innerHTML=msg.data;
        break;

      case "OFFER-DRAW":
        document.getElementById("askForDraw").classList.toggle("show");
        // document.getElementById("askForDraw").classList.toggle("fade-out");
        break;

      case "UPDATE-TIMER":
        var color = msg.data[0];
        var time = msg.data[1];
        let seconds = time % 60 + "";
        var min = Math.floor(time / 60);
        if (time > 0){
            if(seconds.length < 2) {
            seconds = "0" + seconds;
          }
        }
        else{
          min = "00";
          seconds = "00";
        }

        if (color == activeMatch.myColor) { 
          myTimer.innerHTML = min + ":" + seconds; 
        }
        else { 
          enemyTimer.innerHTML = min + ":" + seconds; 
        }
        break;
      default:
        console.log("error?");
    }


  }

});

function historyHelper(previous, match) {
  let start = previous.startPos;
  let end = previous.endPos;
  match.board[start[0]][start[1]] = previous.piece;
  previous.piece.position = start;
  match.board[end[0]][end[1]] = previous.endPiece;
}


// Puts the visual pieces on the board
function drawGameStart(match) {
  let htmlBoard = document.getElementById("chess-board");
  let i = 0;
  let y = 0;
  let x = 0;

  // Checks which side
  if (match.myColor == "white") {
    x = 0;
  } else {
    x = 7;
  }

  for (row of match.board) {

    // Creates the row element
    const htmlRow = document.createElement("div");
    htmlRow.classList.add("row");

    // Checks which side
    if (match.myColor == "white") {
      y = 0;
    } else {
      y = 7;
    }

    for (column of row) {

      // makes blocks
      const htmlColumn = document.createElement("div");
      htmlColumn.classList.add("column");
      const id = String(x) + String(y);
      htmlColumn.setAttribute("id", id);
      if (i % 2 == 0) {
        htmlColumn.classList.add("white-block");
      }

      // makes piece
      if (column != "") {
        const htmlImage = document.createElement("IMG");
        htmlImage.classList.add("piece");
        htmlImage.style.position = "absolute";
        htmlImage.style.zIndex = "10"
        htmlImage.style.left = x * 75 + "px";
        htmlImage.style.top = y * 75 + "px";
        htmlImage.classList.add(column.name);
        htmlImage.setAttribute('draggable', false);

        // gives the html attributes to the piece
        column.htmlPosition = [(x * 75 + "px"), (y * 75 + "px")];
        column.htmlRef = htmlImage;

        // Import images
        const color = column.color;
        const piece = lookup[column.name];
        const loc = "images/" + color + "_" + piece + ".svg";

        htmlImage.setAttribute("src", loc);

        // Only active pieces get listeners
        if (column.color == match.myColor) {

          // Click and hold
          htmlImage.addEventListener("mousedown", function () {
            mouseDownFun(match, htmlImage);
          }, true)

          // Click
          htmlImage.addEventListener("click", function (event) {
            if(options.clickMove) {
              if(match.clickCounter > 0) {
                match.clickCounter = 0;
                mouseUpFun(match, event, htmlBoard, htmlImage);
              } else {
                match.clickCounter++;
              }
            } 
        }, true)

          // let go of click
          htmlImage.addEventListener("mouseup", function (event) {
            if(!options.clickMove) {
              mouseUpFun(match, event, htmlBoard, htmlImage);
            }

          }, true)

          // move around while holding
          htmlImage.addEventListener('mousemove', function (event) {
            if (match.myMove) {

              event.preventDefault();
              const offset = htmlBoard.getBoundingClientRect();
              // Checks correspondence
              if (match.pieceHeld == htmlImage.classList[1]) {
                const xCord = event.clientX - offset.left - 37;
                const yCord = event.clientY - offset.top - 45;
                // Removes the move if it goes out of focus
                if (xCord < -40 || xCord > 570 || yCord > 580 || yCord < -40) {
                  const piece = match.myPieces.find((x) => {
                    return x.name == htmlImage.classList[1];
                  })
                  htmlImage.style.zIndex = "10"
                  match.pieceHeld = "";
                  htmlImage.style.left = piece.htmlPosition[0];
                  htmlImage.style.top = piece.htmlPosition[1];
                  match.pieceHTML = null;
                } else {
                  htmlImage.style.left = xCord + "px";
                  htmlImage.style.top = yCord + "px";
                }
              }
            }
          }, true);



        }

        htmlColumn.appendChild(htmlImage);
      }


      htmlRow.appendChild(htmlColumn);
      i++;


      if (match.myColor == "white") {
        y++;
      } else {
        y--;
      }
    }
    i++;
    htmlBoard.appendChild(htmlRow);
    if (match.myColor == "white") {
      x++;
    } else {
      x--;
    }
  }


}


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
}

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}