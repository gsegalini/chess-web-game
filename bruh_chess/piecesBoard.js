/* eslint-disable no-unused-vars */
let board = 
[["", "", "", "", "", "", "", ""],
["", "", "", "", "", "", "", ""],
["", "", "", "", "", "", "", ""],
["", "", "", "", "", "", "", ""],
["", "", "", "", "", "", "", ""],
["", "", "", "", "", "", "", ""],
["", "", "", "", "", "", "", ""],
["", "", "", "", "", "", "", ""]];


/** this board stores the only valid board of the game. everytime someone clicks a piece the server will give him the possible moves, 
 *  he can choose from only those and after the choice it will send the new move back. the server will calculate the new board and it will send it
 * to both players. 
 */
function createBoard(){
    for (let x = 0;x<8;x++){
        board[x][1] = new pawn("pb"+(8-x), "black", [x,1]);
        board[x][6] = new pawn("pw"+x, "white", [x,6]);
    }
    board[0][0] = new rook("rb1", "black", [0,0]);
    board[7][0] = new rook("rb0", "black", [7,0]);
    board[0][7] = new rook("rw0", "white", [0,7]);
    board[7][7] = new rook("rw1", "white", [7,7]);
    board[1][0] = new knight("kb1", "black", [1,0]);
    board[6][0] = new knight("kb0", "black", [6,0]);
    board[1][7] = new knight("kw0", "white", [1,7]);
    board[6][7] = new knight("kw1", "white", [6,7]);
    board[2][0] = new bishop("bb1", "black", [2,0]);
    board[5][0] = new bishop("bb0", "black", [5,0]);
    board[2][7] = new bishop("bw0", "white", [2,7]);
    board[5][7] = new bishop("bw1", "white", [5,7]);
    board[3][7] = new king("kw", "white", [3,7]);
    board[4][7] = new queen("qw", "white", [4,7]);
    board[3][0] = new king("kb", "black", [3,0]);
    board[4][0] = new queen("qb", "black", [4,0]);
}

// TODO finish move validation for each piece, for strange rules if we want.
function gamePiece(name, color, moveFunction, startPosition){
    this.name = name;
    this.color = color;
    this.move = moveFunction;
    this.moved = 0;
    this.position = startPosition;

    this.increaseMoved = function(){this.moved++};
    this.setPosition = function(x,y){this.position = [x,y]};
    this.getMoves = function(){return this.move(this.position[0], this.position[1], this.color, this.moved)};
}

function pawnMove(x, y, color, moved){
    let possibles = [];
    if (color === "white"){
        if (board[x][y+1] === undefined) possibles.push([x, y+1]);
        if (moved === 0)
            if (board[x][y+2] === undefined) possibles.push([x, y+2]);
        if (board[x+1][y+1] != undefined && board[x+1][y+1].color != color){
            possibles.push[x+1, y+1];
        }
        if (board[x-1][y+1] != undefined && board[x-1][y+1].color != color){
            possibles.push[x-1, y+1];
        }
    }
    else{
        if (board[x][y-1] === undefined) possibles.push([x, y-1]);
        if (moved === 0)
            if (board[x][y-2] === undefined) possibles.push([x, y-2]);
        if (board[x+1][y-1] != undefined && board[x+1][y-1].color != color){
            possibles.push[x+1, y-1];
        }
        if (board[x-1][y-1] != undefined && board[x-1][y-1].color != color){
            possibles.push[x-1, y-1];
        }
    }

    return possibles;
}

function pawn(name, color, startPosition){
    return new gamePiece(name, color, pawnMove, startPosition)
}


function bishopMove(x, y, color, _moved){
    let possibles = [];
    let pairs = [[1,1], [1,-1], [-1,1], [-1,-1]];

    for (var i = 0;i<4;i++){
        for (var k = 1;k<8;k++){
            let actual = [x+k*pairs[i][0], y+k*pairs[i][1]];
            if (actual[0] < 8 && actual[0] >= 0 && actual[1] < 8 && actual[1] >= 0){ //move is in the grid
                var rx = actual[0];
                var ry = actual[1];
                if (board[rx][ry] != undefined && board[rx][ry] != ""){//check the color
                    if (board[rx][ry].color === color) break; //same color, break
                    else {possibles.push(actual); break;}
                }
                possibles.push(actual);
            }
        }
    }
    return possibles;
}

function bishop(name, color, startPosition){
    return new gamePiece(name, color, bishopMove, startPosition);
}

function rookMove(x, y, color, _moved){
    let possibles = [];
    let pairs = [[1,0], [-1,0], [0,1], [0,-1]];

    for (var i = 0;i<4;i++){
        for (var k = 1;k<8;k++){
            let actual = [x+k*pairs[i][0], y+k*pairs[i][1]];
            if (actual[0] < 8 && actual[0] >= 0 && actual[1] < 8 && actual[1] >= 0){ //move is in the grid
                var rx = actual[0];
                var ry = actual[1];
                if (board[rx][ry] != undefined && board[rx][ry] != ""){//check the color
                    if (board[rx][ry].color === color) break; //same color, break
                    else {possibles.push(actual); break;}
                }
                possibles.push(actual);
            }
        }
    }
    return possibles;
}

function rook(name, color, startPosition){
    return new gamePiece(name, color, rookMove, startPosition);
}

function knightMove(x, y, color, _moved){
    let possibles = [];
    let pairs = [[2,1], [1,2], [2,-1], [1,-2], [-1,-2], [-2,-1],[-2,1],[-1,2]];

    for (var i = 0;i<8;i++){
        let actual = [x+pairs[i][0], y + pairs[i][1]];
        if (actual[0] < 8 && actual[0] >= 0 && actual[1] < 8 && actual[1] >= 0){ //on the grid, check color
            var rx = actual[0];
            var ry = actual[1];
            if (board[rx][ry] != undefined && board[rx][ry] != ""){ //color check
                if (board[rx][ry].color === color) {continue;}
            }
            possibles.push(actual);
        }
    }
    return possibles;
}

function knight(name, color, startPosition){
    return new gamePiece(name, color, knightMove, startPosition);
}

function kingMove(x, y, color, _moved){
    let possibles = [];
    let pairs = [[1,0], [1,1], [0,1], [-1,1], [-1,0], [-1,-1],[0,-1],[1,-1]];
    for (var i = 0;i<8;i++){
        let actual = [x+pairs[i][0], y + pairs[i][1]];
        if (actual[0] < 8 && actual[0] >= 0 && actual[1] < 8 && actual[1] >= 0){ //on the grid, check color
            var rx = actual[0];
            var ry = actual[1];
            if (board[rx][ry] != undefined && board[rx][ry] != ""){ //color check
                if (board[rx][ry].color === color) {continue;}
            }
            possibles.push(actual);
        }
    }
    return possibles;
}

function king(name, color, startPosition){
    return new gamePiece(name, color, kingMove, startPosition);
}

function queenMove(x, y, color, _moved){
    let possibles = [];         //check verticals and the diagonals in the same way as always, just double the pairs
    let pairs = [[1,0], [-1,0], [0,1], [0,-1], [1,1], [1,-1], [-1,1], [-1,-1]];
    for (var i = 0;i<8;i++){    
        for (var k = 1;k<8;k++){
            let actual = [x+k*pairs[i][0], y+k*pairs[i][1]];
            if (actual[0] < 8 && actual[0] >= 0 && actual[1] < 8 && actual[1] >= 0){ //move is in the grid
                var rx = actual[0];
                var ry = actual[1];
                if (board[rx][ry] != undefined && board[rx][ry] != ""){//check the color
                    if (board[rx][ry].color === color) break; //same color, break
                    else {possibles.push(actual); break;}
                }
                possibles.push(actual);
            }
        }
    }
    return possibles;
}

function queen(name, color, startPosition){
    return new gamePiece(name, color, queenMove, startPosition);
}

if (require.main === module) {
    createBoard();
    board[3][6] = "";
    board[4][6] = "";
    console.log(board[4][7].getMoves());
}