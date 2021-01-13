/* eslint-disable no-unused-vars */

/**
 * TODO find a way to connect a function sending websockets messages to the pieces images
 * Idea of implementing squares where king is checked: make seperate board which contains locations, which the king can move to
 */

let activeMatch;
const moveAudio = new Audio("files/move.wav");
const captureAudio = new Audio("files/capture.wav");

window.addEventListener('load', function () {
  const socket = new WebSocket("ws://localhost:25565");

  socket.onmessage = function (event) {
    const msg = JSON.parse(event.data);
    
    if (msg.type == "PLAYER-COLOR") {

      activeMatch = new Match(msg.data, socket);
      draw(activeMatch);
      window.addEventListener('mousemove', function (event) {
        event.preventDefault();
        const offset = document.getElementById("chess-board").getBoundingClientRect();
        // Checks correspondence
        if (activeMatch.pieceHTML != null) {
          const xCord = event.clientX - offset.left - 37;
          const yCord = event.clientY - offset.top - 45;
          // Removes the move if it goes out of focus
          if (xCord < -40 || xCord > 570 || yCord > 580 || yCord < -40) {
          } else {
            activeMatch.pieceHTML.style.left = xCord + "px";
            activeMatch.pieceHTML.style.top = yCord + "px";
          }
        }
      })
    }
  }

});



// Puts the visual pieces on the board
function draw(match) {
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

        // gives the html attributes to the piece
        column.htmlPosition = [(x * 75 + "px"), (y * 75 + "px")];
        column.htmlRef = htmlImage;

        const color = column.color;
        const piece = lookup[column.name];

        htmlImage.classList.add(column.name);
        const loc = "images/" + color + "_" + piece + ".svg";

        htmlImage.setAttribute("src", loc);
        htmlImage.setAttribute('draggable', false);

        // Only active pieces get listeners
        if (column.color == match.myColor) {

          // Click and hold
          htmlImage.addEventListener("mousedown", function () {
            if (match.myMove) {
              const piece = match.myPieces.find((x) => {
                return x.name == htmlImage.classList[1];
              })
              match.pieceHTML = htmlImage;
              // disables focus for all
              document.querySelectorAll(".focused").forEach(e => e.classList.remove("focused"))

              // deletes movable
              document.querySelectorAll(".container-movable").forEach(e => e.remove());

              // Draws points to which the piece can move
              const moves = piece.getMoves();
              // console.table(moves);
              for (let index = 0; index < moves.length; index++) {

                const container = document.createElement("div");
                container.classList.add("container-movable");

                const movable = document.createElement("div");
                movable.classList.add("movable");
                container.appendChild(movable);

                const id = String(moves[index][0]) + String(moves[index][1]);

                document.getElementById(id).appendChild(container);
              }

              // Adds focus attributes
              const currentLoc = String(piece.position[0]) + String(piece.position[1])
              document.getElementById(currentLoc).classList.add("focused");
              htmlImage.style.zIndex = "1000"
              match.pieceHeld = htmlImage.classList[1];
            }
          }, true)


          // let go of click
          htmlImage.addEventListener("mouseup", function (event) {
            if (match.myMove) {
              match.pieceHTML = null;
              const piece = match.myPieces.find((x) => {
                return x.name == htmlImage.classList[1];
              })
              const offset = htmlBoard.getBoundingClientRect();
              const xCord = event.clientX - offset.left;
              const yCord = event.clientY - offset.top;
              // Find position based on pov
              const position = match.myColor == "white" ? getBoardPositionWhite(xCord, yCord) : getBoardPositionBlack(xCord, yCord);

              // Check if the move was valid
              const moves = piece.getMoves();
              for (let index = 0; index < moves.length; index++) {
                const id = String(moves[index][0]) + String(moves[index][1]);

                // Confirms move
                if (id == position) {
                  document.querySelectorAll(".container-movable").forEach(e => e.remove());
                  const normalCord = normalizeCoordinates(xCord, yCord);
                  piece.htmlPosition = normalCord;
                  piece.increaseMoved();

                  // Checks for capturing piece
                  const checkBlock = match.board[moves[index][0]][moves[index][1]];
                  if (checkBlock != "") {
                    captureAudio.play();
                    match.opponentDeadPieces.push(checkBlock);
                    drawDeadPieces(checkBlock);
                    const nameOfRemoved = checkBlock.name;
                    document.querySelectorAll("." + nameOfRemoved).forEach(e => e.remove());
                    match.opponentPieces.filter((elem) => {
                      return elem != checkBlock
                    });
                    match.board[moves[index][0]][moves[index][1]] = "";
                  } else {
                    moveAudio.play();
                  }

                  // Records history 
                  const startPos = [piece.position[0], piece.position[1]];
                  const endPos =[moves[index][0], moves[index][1]];
                  match.moveHistory.push({
                    piece: piece,
                    startPos,
                    endPos,
                  });

                  // makes the positional change
                  match.board[piece.position[0]][piece.position[1]] = "";
                  piece.setPosition(moves[index][0], moves[index][1])
                  match.board[piece.position[0]][piece.position[1]] = piece; //it is not piece.name, but piece

                  // focuses the move
                  const currentLoc = String(piece.position[0]) + String(piece.position[1])
                  document.getElementById(currentLoc).classList.add("focused");

                  match.myMove = false;

                  // Send Server
                  
                  sendMove(match.socket,startPos, endPos);
                  
                  break;
                }

              }

              // Resets defaults
              htmlImage.style.zIndex = "10"
              match.pieceHeld = "";
              htmlImage.style.left = piece.htmlPosition[0];
              htmlImage.style.top = piece.htmlPosition[1];
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


function drawDeadPieces(piece) {

  const htmlImage = document.createElement("IMG");
  htmlImage.classList.add("deadPiece");
  htmlImage.style.zIndex = "10"

  const color = piece.color;
  const nameOfPiece = lookup[piece.name];

  const loc = "images/" + color + "_" + nameOfPiece + ".svg";

  htmlImage.setAttribute("src", loc);
  htmlImage.setAttribute('draggable', false);
  const deadContainer = document.createElement("div");
  deadContainer.classList.add("deadcontainer");
  deadContainer.appendChild(htmlImage)
  document.getElementById("enemyPieces").appendChild(deadContainer);
}

function getBoardPositionWhite(x, y) {
  return String(Math.floor(x / 75)) + String(Math.floor(y / 75));
}

function getBoardPositionBlack(x, y) {
  return String(Math.floor((600 - x) / 75)) + String(Math.floor((600 - y) / 75));
}

function normalizeCoordinates(x, y) {
  const res = [];
  let realX = 0;
  while (realX + 75 <= x) {
    realX += 75;
  }
  let realY = 0;
  while (realY + 75 <= y) {
    realY += 75;
  }
  realX += "px";
  realY += "px";
  res.push(realX, realY);

  return res;
}

function setupPieces(board) {
  for (var x = 0; x < 8; x++) {
    for (var y = 0; y < 8; y++) {
      if (board[x][y] != undefined && board[x][y] != "") {
        board[x][y].setBoard(board);
      }
    }
  }
}




// TODO finish move validation for each piece, for strange rules if we want.
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
