function pawnMove(x, y, color, moved) {
  let possibles = [];
  if (color === "black") {
    if (this.board[x][y + 1] === undefined || this.board[x][y + 1] === "") possibles.push([x, y + 1]);    
    if (moved === 0)
      if (this.board[x][y + 2] === undefined || this.board[x][y + 2] === "") possibles.push([x, y + 2]);
    if ((x + 1) < 8 && this.board[x + 1][y + 1] != undefined && this.board[x + 1][y + 1] != "" && this.board[x + 1][y + 1].color != color) {
      possibles.push[x + 1, y + 1];
    }
    if ((x - 1) >= 0 && this.board[x - 1][y + 1] != undefined && this.board[x - 1][y + 1] != "" && this.board[x - 1][y + 1].color != color) {
      possibles.push[x - 1, y + 1];
    }
  }
  else {
    if (this.board[x][y - 1] === undefined || this.board[x][y - 1] === "") possibles.push([x, y - 1]);
    if (moved === 0)
      if (this.board[x][y - 2] === undefined || this.board[x][y - 2] === "") possibles.push([x, y - 2]);
    if ((x + 1) < 8 && this.board[x + 1][y - 1] != undefined && this.board[x + 1][y - 1] != "" && this.board[x + 1][y - 1].color != color) {
      possibles.push[x + 1, y - 1];
    }
    if ((x - 1) >= 0 && this.board[x - 1][y - 1] != undefined && this.board[x - 1][y - 1] != "" && this.board[x - 1][y - 1].color != color) {
      possibles.push[x - 1, y - 1];
    }
  }

  return possibles;
}

function pawn(name, color, startPosition) {
  return new gamePiece(name, color, pawnMove, startPosition)
}


function bishopMove(x, y, color, _moved) {
  let possibles = [];
  let pairs = [[1, 1], [1, -1], [-1, 1], [-1, -1]];

  for (var i = 0; i < 4; i++) {
    for (var k = 1; k < 8; k++) {
      let actual = [x + k * pairs[i][0], y + k * pairs[i][1]];
      if (actual[0] < 8 && actual[0] >= 0 && actual[1] < 8 && actual[1] >= 0) { //move is in the grid
        var rx = actual[0];
        var ry = actual[1];
        if (this.board[rx][ry] != undefined && this.board[rx][ry] != "") {//check the color
          if (this.board[rx][ry].color === color) break; //same color, break
          else { possibles.push(actual); break; }
        }
        possibles.push(actual);
      }
    }
  }
  return possibles;
}

function bishop(name, color, startPosition) {
  return new gamePiece(name, color, bishopMove, startPosition);
}

function rookMove(x, y, color, _moved) {
  let possibles = [];
  let pairs = [[1, 0], [-1, 0], [0, 1], [0, -1]];

  for (var i = 0; i < 4; i++) {
    for (var k = 1; k < 8; k++) {
      let actual = [x + k * pairs[i][0], y + k * pairs[i][1]];
      if (actual[0] < 8 && actual[0] >= 0 && actual[1] < 8 && actual[1] >= 0) { //move is in the grid
        var rx = actual[0];
        var ry = actual[1];
        if (this.board[rx][ry] != undefined && this.board[rx][ry] != "") {//check the color
          if (this.board[rx][ry].color === color) break; //same color, break
          else { possibles.push(actual); break; }
        }
        possibles.push(actual);
      }
    }
  }
  return possibles;
}

function rook(name, color, startPosition) {
  return new gamePiece(name, color, rookMove, startPosition);
}

function knightMove(x, y, color, _moved) {
  let possibles = [];
  let pairs = [[2, 1], [1, 2], [2, -1], [1, -2], [-1, -2], [-2, -1], [-2, 1], [-1, 2]];

  for (var i = 0; i < 8; i++) {
    let actual = [x + pairs[i][0], y + pairs[i][1]];
    if (actual[0] < 8 && actual[0] >= 0 && actual[1] < 8 && actual[1] >= 0) { //on the grid, check color
      var rx = actual[0];
      var ry = actual[1];
      if (this.board[rx][ry] != undefined && this.board[rx][ry] != "") { //color check
        if (this.board[rx][ry].color === color) { continue; }
      }
      possibles.push(actual);
    }
  }
  return possibles;
}

function knight(name, color, startPosition) {
  return new gamePiece(name, color, knightMove, startPosition);
}

function kingMove(x, y, color, _moved) {
  let possibles = [];
  let pairs = [[1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1], [1, -1]];
  for (var i = 0; i < 8; i++) {
    let actual = [x + pairs[i][0], y + pairs[i][1]];
    if (actual[0] < 8 && actual[0] >= 0 && actual[1] < 8 && actual[1] >= 0) { //on the grid, check color
      var rx = actual[0];
      var ry = actual[1];
      if (this.board[rx][ry] != undefined && this.board[rx][ry] != "") { //color check
        if (this.board[rx][ry].color === color) { continue; }
      }
      possibles.push(actual);
    }
  }

  if (_moved === 0) {
    if (color === "white") {
      if (x == 4 && y == 7) {
        if (this.board[7][7].name === "rw1" && this.board[7][7].moved === 0) {
          if (this.board[6][7] == "" && this.board[5][7] == "") {
            console.log("castle kingside!");
            possibles.push([6, 7]);
          }
        }
        if (this.board[0][7].name === "rw0" && this.board[0][7].moved === 0) {
          if (this.board[1][7] == "" && this.board[2][7] == "" && this.board[3][7] == "") {
            console.log("castle queenside!");
            possibles.push([2, 7]);
          }
        }
      }

    } else {
      if (x == 4 && y == 0) {
        if (this.board[7][0].name === "rb0" && this.board[7][0].moved === 0) {
          if (this.board[6][0] == "" && this.board[5][0] == "") {
            console.log("castle kingside!");
            possibles.push([6, 0]);
          }
        }
        if (this.board[0][0].name === "rb1" && this.board[0][0].moved === 0) {
          if (this.board[1][0] == "" && this.board[2][0] == "" && this.board[3][0] == "") {
            console.log("castle queenside!");
            possibles.push([2, 0]);
          }
        }
      }
    }
  }


  return possibles;
}

function king(name, color, startPosition) {
  return new gamePiece(name, color, kingMove, startPosition);
}

function queenMove(x, y, color, _moved) {
  let possibles = [];         //check verticals and the diagonals in the same way as always, just double the pairs
  let pairs = [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]];
  for (var i = 0; i < 8; i++) {
    for (var k = 1; k < 8; k++) {
      let actual = [x + k * pairs[i][0], y + k * pairs[i][1]];
      if (actual[0] < 8 && actual[0] >= 0 && actual[1] < 8 && actual[1] >= 0) { //move is in the grid
        var rx = actual[0];
        var ry = actual[1];
        if (this.board[rx][ry] != undefined && this.board[rx][ry] != "") {//check the color
          if (this.board[rx][ry].color === color) break; //same color, break
          else { possibles.push(actual); break; }
        }
        possibles.push(actual);
      }
    }
  }
  return possibles;
}

function queen(name, color, startPosition) {
  return new gamePiece(name, color, queenMove, startPosition);
}



function createBoard(my, opponent) {
  let board =
    [["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""]];
  for (let x = 0; x < 8; x++) {
    let pw = new pawn("pw" + x, "white", [x, 6]);
    let pb = new pawn("pb" + x, "black", [x, 1]);
    my.push(pw);
    board[x][1] = pb;
    opponent.push(pb);
    board[x][6] = pw;
  }
  let rb1 = new rook("rb1", "black", [0, 0]);
  let rb0 = new rook("rb0", "black", [7, 0]);
  let rw0 = new rook("rw0", "white", [0, 7]);
  let rw1 = new rook("rw1", "white", [7, 7]);
  let kb1 = new knight("kb1", "black", [1, 0]);
  let kb0 = new knight("kb0", "black", [6, 0]);
  let kw0 = new knight("kw0", "white", [1, 7]);
  let kw1 = new knight("kw1", "white", [6, 7]);
  let bb1 = new bishop("bb1", "black", [2, 0]);
  let bb0 = new bishop("bb0", "black", [5, 0]);
  let bw0 = new bishop("bw0", "white", [2, 7]);
  let bw1 = new bishop("bw1", "white", [5, 7]);
  let kw = new king("kw", "white", [4, 7]);
  let qw = new queen("qw", "white", [3, 7]);
  let kb = new king("kb", "black", [4, 0]);
  let qb = new queen("qb", "black", [3, 0]);
  my.push(rw0, rw1, kw0, kw1, bw0, bw1, kw, qw);
  opponent.push(rb0, rb1, kb0, kb1, bb0, bb1, kb, qb);

  board[0][0] = rb1;
  board[7][0] = rb0;
  board[0][7] = rw0;
  board[7][7] = rw1;
  board[1][0] = kb1;
  board[6][0] = kb0;
  board[1][7] = kw0;
  board[6][7] = kw1;
  board[2][0] = bb1;
  board[5][0] = bb0;
  board[2][7] = bw0;
  board[5][7] = bw1;
  board[4][7] = kw;
  board[3][7] = qw;
  board[4][0] = kb;
  board[3][0] = qb;
  return board;
}