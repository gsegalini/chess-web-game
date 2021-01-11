const bObject = require("./piecesBoard");

module.exports = gameObject;

function gameObject(id){
    this.is = id;
    this.boardObj = new bObject();
    this.whiteAlive = [];
    this.blackAlive =[];
    this.whiteDead = [];
    this.blackDead = [];
    this.p1websocket = "placeholder";
    this.p2websocket = "placeholder";
    this.turn = "white";

    this.board = function(){return this.boardObj.board};
    this.addPlayer = function(socket){
        if (this.p1websocket === "placeholder"){ this.p1websocket = socket; return "white";}
        else{ this.p2websocket = socket; return "black";}
    }
    this.changeTurn = function(){
        if (this.turn === "white") this.turn = "black";
        else this.turn = "white";
    }
    this.validateMove = function(start, end){
        var piece = this.boardObj.getPiece(start);
        if (piece === "" || piece === undefined){return false;}
        var possibles = piece.getMoves();
        for (var i = 0;i<possibles.length;i++){
            var a = possibles[i];
            if (a[0] == end[0] && a[1] == end[1]) return true;
        }
        return false;
    }

    this.movePiece = function(start, end){
        var tempP = this.boardObj.getPiece(start);
        this.board()[start[0]][start[1]] = "";
        var tempA = this.boardObj.getPiece(end);
        if (tempA != undefined && tempA != ""){//tempA is dead
            var index;
            if (tempA.color === "white"){
                this.whiteDead.push(tempA.name);
                index = this.whiteAlive.indexOf(tempA);
                this.whiteAlive.splice(index, 1);
            }
            else{
                this.blackDead.push(tempA.name);
                index = this.blackAlive.indexOf(tempA);
                this.blackAlive.splice(index, 1);
            }
        }
        this.board()[end[0]][end[1]] = tempP;
    }
    /**
     * possible statuses:
     * 0-JOINT no players
     * 1-JOINT 1 player
     * 2-JOINT 2 players
     * W-WIN white wins
     * B-WIN black wins
     */
    this.status = "0-JOINT";                

    for (var x = 0;x<8;x++){
        for (var y = 0;y<8;y++){
            if (this.board()[x][y] != undefined && this.board()[x][y] != ""){
                var piece = this.board()[x][y];
                if (piece.color === "white") {this.whiteAlive.push(piece.name)}
                else {this.blackAlive.push(piece.name)}
            }
        }
    }
}



if (require.main === module) {
    let game = new gameObject();
    console.table(game.board());
    console.log(game.validateMove([0,1], [0,2]));
    game.movePiece([0,0], [0,7]);
    console.table(game.board());
}
