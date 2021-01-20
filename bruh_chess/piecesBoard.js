/* eslint-disable no-unused-vars */

/**
 * This object stores the board of a game
 */

module.exports = boardObject;
function boardObject() {

    this.board = createBoard();
    this.getPiece = function (coords) {
        return this.board[coords[0]][coords[1]];
    }
    setupPieces(this.board);


    function setupPieces(board) {
        for (var x = 0; x < 8; x++) {
            for (var y = 0; y < 8; y++) {
                if (board[x][y] != undefined && board[x][y] != "") {
                    board[x][y].setBoard(board);
                }
            }
        }
    }

    function createBoard() {
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
            board[x][1] = new pawn("pb" + x, "black", [x, 1]);   // Why are these numbered backwards?, because they are numbered "correctly" if we look at them from their side
            board[x][6] = new pawn("pw" + x, "white", [x, 6]);
        }
        board[0][0] = new rook("rb1", "black", [0, 0]);
        board[7][0] = new rook("rb0", "black", [7, 0]);
        board[0][7] = new rook("rw0", "white", [0, 7]);
        board[7][7] = new rook("rw1", "white", [7, 7]);
        board[1][0] = new knight("kb1", "black", [1, 0]);
        board[6][0] = new knight("kb0", "black", [6, 0]);
        board[1][7] = new knight("kw0", "white", [1, 7]);
        board[6][7] = new knight("kw1", "white", [6, 7]);
        board[2][0] = new bishop("bb1", "black", [2, 0]);
        board[5][0] = new bishop("bb0", "black", [5, 0]);
        board[2][7] = new bishop("bw0", "white", [2, 7]);
        board[5][7] = new bishop("bw1", "white", [5, 7]);
        board[4][7] = new king("kw", "white", [4, 7]);    // I swapped both kings and q
        board[3][7] = new queen("qw", "white", [3, 7]);
        board[4][0] = new king("kb", "black", [4, 0]);
        board[3][0] = new queen("qb", "black", [3, 0]);
        return board;
    }


    // TODO finish move validation for each piece, for strange rules if we want.
    function gamePiece(name, color, moveFunction, startPosition, board) {
        this.name = name;
        this.color = color;
        this.move = moveFunction;
        this.moved = 0;
        this.position = startPosition;
        this.board = null;
        this.increaseMoved = function () { this.moved++ };
        this.setPosition = function (x, y) { this.position = [x, y] };
        this.getMoves = function () { return this.move(this.position[0], this.position[1], this.color, this.moved) };
        this.setBoard = function (board) { this.board = board };
    }

    function pawnMove(x, y, color, moved) {
        let possibles = [];
        if (color === "black") {
            if (y + 1 < 8) {
                if (this.board[x][y + 1] === undefined || this.board[x][y + 1] === "") possibles.push([x, y + 1]);
                if (moved === 0)
                    if (this.board[x][y + 2] === undefined || this.board[x][y + 2] === "") possibles.push([x, y + 2]);
                if ((x + 1) < 8 && this.board[x + 1][y + 1] != undefined && this.board[x + 1][y + 1] != "" && this.board[x + 1][y + 1].color != color) {
                    possibles.push([x + 1, y + 1]);
                }
                if ((x - 1) >= 0 && this.board[x - 1][y + 1] != undefined && this.board[x - 1][y + 1] != "" && this.board[x - 1][y + 1].color != color) {
                    possibles.push([x - 1, y + 1]);
                }
            }
        }
        else {
            if (y - 1 >= 0) {
                if (this.board[x][y - 1] === undefined || this.board[x][y - 1] === "") possibles.push([x, y - 1]);
                if (moved === 0)
                    if (this.board[x][y - 2] === undefined || this.board[x][y - 2] === "") possibles.push([x, y - 2]);
                if ((x + 1) < 8 && this.board[x + 1][y - 1] != undefined && this.board[x + 1][y - 1] != "" && this.board[x + 1][y - 1].color != color) {
                    possibles.push([x + 1, y - 1]);
                }
                if ((x - 1) >= 0 && this.board[x - 1][y - 1] != undefined && this.board[x - 1][y - 1] != "" && this.board[x - 1][y - 1].color != color) {
                    possibles.push([x - 1, y - 1]);
                }
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

        
        //remove from possibles all enemy moves

        var enemy = []
        for (var xe = 0;xe<8;xe++){
            for (var ye = 0;ye<8;ye++){
                var p = this.board[xe][ye];
                if (p != "" && p != undefined && p.color != this.color){
      
                    if (p.name == "kw" || p.name == "kb"){
                        enemy.push([xe+1,ye])
                        enemy.push([xe+1,ye+1])
                        enemy.push([xe,ye+1])
                        enemy.push([xe-1,ye+1])
                        enemy.push([xe-1,ye])
                        enemy.push([xe-1,ye-1])
                        enemy.push([xe,ye-1])
                        enemy.push([xe+1,ye-1])
                    }
                    else if (p.name.startsWith("p")){
                        if (p.color == "black"){
                            enemy.push([xe+1, ye+1]);
                            enemy.push([xe-1, ye+1]);
                        }
                        else{
                            enemy.push([xe+1, ye-1]);
                            enemy.push([xe-1, ye-1]);                            
                        }
                    }
                    else{
                        var temp = p.board[x][y];
                        //console.log(temp.name);
                        p.board[x][y] = "";
                        enemy.push(...p.getMoves());
                        p.board[x][y] = temp;
                    }
                }
            }
        }
        // if (_moved === 0) {
        //     if (color === "white") {
        //         if (x == 4 && y == 7) {
        //             if (this.board[7][7].name === "rw1" && this.board[7][7].moved === 0) {
        //                 if (this.board[6][7] == "" && this.board[5][7] == "") {
        //                     console.log("castle kingside!");
        //                     possibles.push([6, 7]);
        //                 }
        //             }
        //             if (this.board[0][7].name === "rw0" && this.board[0][7].moved === 0) {
        //                 if (this.board[1][7] == "" && this.board[2][7] == "" && this.board[3][7] == "") {
        //                     console.log("castle queenside!");
        //                     possibles.push([2, 7]);
        //                 }
        //             }
        //         }

        //     } else {
        //         if (x == 4 && y == 0) {
        //             if (this.board[7][0].name === "rb0" && this.board[7][0].moved === 0) {
        //                 if (this.board[6][0] == "" && this.board[5][0] == "") {
        //                     console.log("castle kingside!");
        //                     possibles.push([6, 0]);
        //                 }
        //             }
        //             if (this.board[0][0].name === "rb1" && this.board[0][0].moved === 0) {
        //                 if (this.board[1][0] == "" && this.board[2][0] == "" && this.board[3][0] == "") {
        //                     console.log("castle queenside!");
        //                     possibles.push([2, 0]);
        //                 }
        //             }
        //         }
        //     }
        // }


        //console.log(enemy);
        //console.log(enemy.includes([4, 2]))
        for (var i = 0;i<enemy.length;i++){
            for (var j = 0;j<possibles.length;j++){
                if (enemy[i][0] == possibles[j][0] && enemy[i][1] == possibles[j][1]){
                    possibles.splice(j,1);
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
                        if (this.board[rx][ry].color == color) break; //same color, break
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
}
/**
 * testing lines, they start only if executing this file with node
 */
if (require.main === module) {
    let board = new boardObject();
    console.table(board.board);
    console.log(board.getPiece([0, 0]).getMoves());
    console.log(board.getPiece([1, 0]).getMoves());
}
