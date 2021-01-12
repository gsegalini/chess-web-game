/* eslint-disable no-unused-vars */

/**
 * TODO find a way to connect a function sending websockets messages to the pieces images
 */


let activeMatch;


window.addEventListener('load', function () {
  activeMatch = new Match();
  draw(activeMatch);

});

// Puts the visual pieces on the board
function draw(match) {
  let htmlBoard = document.getElementById("chess-board");
  let i = 0;
  let x = 0;
  let y = 0;

  for (row of match.board) {

    const htmlRow = document.createElement("div");
    htmlRow.classList.add("row");
    y = 0;

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

        column.htmlPosition = [(x * 75 + "px"), (y * 75 + "px")];

        column.htmlRef = htmlImage;

        const color = column.color;
        const piece = lookup[column.name];

        htmlImage.classList.add(column.name);
        const loc = "images/" + color + "_" + piece + ".svg";

        htmlImage.setAttribute("src", loc);
        htmlImage.setAttribute('draggable', false);

        // Only active pieces get listeners
        if (column.color == "white") {

          // Click and hold
          htmlImage.addEventListener("mousedown", function () {
            const piece = match.myPieces.find((x) => {
              return x.name == htmlImage.classList[1];
            })

            // disables focus for all
            match.myPieces.forEach((elem) => {
              elem.htmlRef.parentElement.classList.remove("focused")
            });

            // deletes movable
            document.querySelectorAll('.container-movable').forEach(e => e.remove());

            // Draws points to which the piece can move
            const moves = piece.getMoves();
            //console.table(piece.board);
            for (let index = 0; index < moves.length; index++) {

              const container = document.createElement("div");
              container.classList.add("container-movable");

              const movable = document.createElement("div");
              movable.classList.add("movable");
              container.appendChild(movable);

              const id = String(moves[index][0]) + String(moves[index][1]);

              document.getElementById(id).appendChild(container);
            }
            
            htmlImage.parentElement.classList.add("focused");
            htmlImage.style.zIndex = "1000"
            match.pieceHeld = htmlImage.classList[1];
          }, true)


          // let go of click
          htmlImage.addEventListener("mouseup", function (event) {
            const piece = match.myPieces.find((x) => {
              return x.name == htmlImage.classList[1];
            })
            const offset = htmlBoard.getBoundingClientRect();
            const xCord = event.clientX - offset.left;
            const yCord = event.clientY - offset.top;
            
            const position = getBoardPosition(xCord, yCord);
            
            const moves = piece.getMoves();
            for (let index = 0; index < moves.length; index++) {
              const id = String(moves[index][0]) + String(moves[index][1]);
              if(id == position) {
                document.querySelectorAll('.container-movable').forEach(e => e.remove());

                const normalCord = normalizeCoordinates(xCord, yCord);
                
                piece.htmlPosition = normalCord;
                piece.increaseMoved();
                

                match.board[piece.position[0]][piece.position[1]] = "";
                piece.setPosition(moves[index][0], moves[index][1])
                match.board[piece.position[0]][piece.position[1]] = piece; //it is not piece.name, but piece


                break;
              }
            }
            
            htmlImage.style.zIndex = "10"
            match.pieceHeld = "";
            htmlImage.style.left = piece.htmlPosition[0];
            htmlImage.style.top = piece.htmlPosition[1];
          }, true)

          // move around while holding
          htmlImage.addEventListener('mousemove', function (event) {
            event.preventDefault();
            const offset = htmlBoard.getBoundingClientRect();
            if (match.pieceHeld == htmlImage.classList[1]) {
              const xCord = event.clientX - offset.left - 37;
              const yCord = event.clientY - offset.top - 45;
              if (xCord < -40 || xCord > 570 || yCord > 580 || yCord < -40) {
                const piece = match.myPieces.find((x) => {
                  return x.name == htmlImage.classList[1];
                })
                htmlImage.style.zIndex = "10"
                match.pieceHeld = "";
                htmlImage.style.left = piece.htmlPosition[0];
                htmlImage.style.top = piece.htmlPosition[1];
              } else {
                htmlImage.style.left = xCord + "px";
                htmlImage.style.top = yCord + "px";
              }
            }
          }, true);
        }

        htmlColumn.appendChild(htmlImage);
      }


      htmlRow.appendChild(htmlColumn);
      i++;
      y++;
    }
    i++;
    htmlBoard.appendChild(htmlRow);
    x++;
  }


}


function Match() {
  this.myPieces = [];
  this.opponentPieces = [];

  this.board = createBoard(this.myPieces, this.opponentPieces);
  setupPieces(this.board);

  this.getPiece = function (coords) {
    return this.board[coords[0]][coords[1]];
  }

  this.moveHistory = [];
  this.myDeadPieces = [];
  this.opponentDeadPieces = [];

  this.pieceHeld = "";

}

function getBoardPosition(x, y) {
  return String(Math.floor(x/75)) + String(Math.floor(y/75));
}

function normalizeCoordinates(x, y) {
  const res = [];
  let realX = 0;
  while(realX + 75 < x) {
    realX+=75;
  }
  let realY = 0;
  while(realY +75 < y) {
    realY+=75;
  }
  realX+= "px";
  realY += "px";
  res.push(realX,realY);

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
