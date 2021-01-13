
function renderEnemyMove(start, end, match) {
  const piece = match.board[start[0]][start[1]];
  const coordinates = findHTMLLocation(end, match.myColor);
  piece.htmlPosition = coordinates;
  piece.increaseMoved();

  // Checks for capturing piece
  const checkBlock = match.board[end[0]][end[1]];
  if (checkBlock != "") {
    captureAudio.play();
    match.myDeadPieces.push(checkBlock);
    drawDeadPieces(checkBlock);
    const nameOfRemoved = checkBlock.name;
    document.querySelectorAll("." + nameOfRemoved).forEach(e => e.remove());
    match.opponentPieces.filter((elem) => {
      return elem != checkBlock
    });
    match.board[end[0]][end[1]] = "";
  } else {
    moveAudio.play();
  }

  // Records history 
  const startPos = [piece.position[0], piece.position[1]];
  const endPos =[end[0], end[1]];
  match.moveHistory.push({
    piece: piece,
    startPos,
    endPos,
  });

  // makes the positional change
  match.board[piece.position[0]][piece.position[1]] = "";
  piece.setPosition(end[0], end[1]);
  match.board[piece.position[0]][piece.position[1]] = piece; 

  // focuses the move
  const currentLoc = String(piece.position[0]) + String(piece.position[1])
  document.getElementById(currentLoc).classList.add("focused");


  // Render the move
  const htmlImage = piece.htmlRef;
  htmlImage.style.left = piece.htmlPosition[0];
  htmlImage.style.top = piece.htmlPosition[1];  
}

function didEnemyMove(start, match) {
  return match.board[start[0]][start[1]] != "";
}

function findHTMLLocation(loc, color) {
  const htmlLoc = [];
  if(color == "white") {
    htmlLoc.push(loc[0]*75 + "px");
    htmlLoc.push(loc[1]*75 + "px");
  } else {
    htmlLoc.push((525-loc[0]*75) + "px");
    htmlLoc.push((525-loc[1]*75) + "px");
  }

  return htmlLoc;
}

function renderGameStart(msg, socket) {
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


function mouseDownFun(match, htmlImage) {
  if (match.myMove) {
    // Finds piece
    const piece = match.myPieces.find((index) => {
      return index.name == htmlImage.classList[1];
    })
    match.pieceHTML = htmlImage;
    
    // disables focus for all
    document.querySelectorAll(".focused").forEach(e => e.classList.remove("focused"));

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
}


function moveDownFun(match, event, htmlBoard, htmlImage) {
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
}