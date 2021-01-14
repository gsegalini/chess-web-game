/* eslint-disable no-unused-vars */

/**
 * TODO find a way to connect a function sending websockets messages to the pieces images
 * Idea of implementing squares where king is checked: make seperate board which contains locations, which the king can move to
 */

let activeMatch;
const moveAudio = new Audio("./files/move.wav");
const captureAudio = new Audio("./files/capture.wav");

var url = "ws://" + location.host;


// Setup
window.addEventListener('load', function () {
  const socket = new WebSocket(url);

  socket.onmessage = function (event) {
    const msg = JSON.parse(event.data);
    console.log(msg);
    switch(msg.type) {

      case "PLAYER-COLOR":
        renderGameStart(msg, socket);
        break;

      case "CONFIRMED-MOVE":
        const whoMoved = didEnemyMove(msg.data[0], activeMatch);
        if(whoMoved) {
          activeMatch.myMove = true;
          renderEnemyMove(msg.data[0], msg.data[1], activeMatch);
        }
      break;

      case "REJECTED-MOVE":
        var previous = activeMatch.moveHistory.slice(-1)[0];
        break;

      case "GAME-ABORTED":
        //show message
        break;
      
      case "RESULT":
        //show msg.data
        break;

      case "OFFER-DRAW":
        //ask for draw and send it back
        break;
      default:
        console.log("error?");
    }


  }

});



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


          // let go of click
          htmlImage.addEventListener("mouseup", function (event) {
            moveDownFun(match, event, htmlBoard, htmlImage);
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


  this.myMove = color == "white";
  this.socket = socket;

  this.board = color == "white" ? createBoard(this.myPieces, this.opponentPieces) : createBoard(this.opponentPieces, this.myPieces);
  setupPieces(this.board);

  this.getPiece = function (coords) {
    return this.board[coords[0]][coords[1]];
  }

  this.moveHistory = [];
  this.myDeadPieces = [];
  this.opponentDeadPieces = [];

  this.pieceHeld = "";
  this.pieceHTML = null;

}


function gamePiece(name, color, moveFunction, startPosition, board) {
  this.name = name;
  this.color = color;
  this.move = moveFunction;
  this.moved = 0;
  this.position = startPosition;
  this.board = null;

  this.htmlRef = null;
  this.htmlPosition = [];

  this.increaseMoved = function () { this.moved++ };
  this.setPosition = function (x, y) { this.position = [x, y] };
  this.getMoves = function () { return this.move(this.position[0], this.position[1], this.color, this.moved) };
  this.setBoard = function (board) { this.board = board };
}
