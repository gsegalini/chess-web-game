const bObject = require("./piecesBoard");
var websocketFunction = require("./websocketsFunctionsServer");

module.exports = gameObject;

function gameObject(id, time, isV){
    let f = new websocketFunction();
    this.id = id;
    this.boardObj = new bObject();
    this.whiteAlive = [];
    this.blackAlive =[];
    this.whiteDead = [];
    this.blackDead = [];
    this.whiteWebSocket = "placeholder";
    this.blackWebSocket = "placeholder";
    this.turn = "white";
    this.draws = 0;
    this.times = {"white": time*60, "black": time*60};
    this.timer = null;
    this.isV = isV;
    this.time = time;
    this.joined = 0;

    this.board = function(){return this.boardObj.board};
    this.addPlayer = function(socket){
        if (this.whiteWebSocket === "placeholder"){ this.whiteWebSocket = socket; return "white";}
        else{ this.blackWebSocket = socket; return "black";}
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
                index = this.whiteAlive.indexOf(tempA.name);
                this.whiteAlive.splice(index, 1);
            }
            else{
                this.blackDead.push(tempA.name);
                index = this.blackAlive.indexOf(tempA.name);
                this.blackAlive.splice(index, 1);
            }
        }
        tempP.increaseMoved();
        tempP.setPosition(end[0],end[1]);
        this.board()[end[0]][end[1]] = tempP;
    }
    /**
     * possible statuses:
     * ABORTED
     * WAITING
     * STARTED
     * W-WIN white wins
     * B-WIN black wins
     * DRAW
     */
    this.status = "WAITING";                

    this.setStatus = function(status){this.status = status;}

    this.checkWin = function(){
        const w = this.whiteDead.find((x) => {
            return x == "kw";
          })
        const b = this.blackDead.find((x) => {
        return x == "kb";
        })
        if (w != undefined) return "black";
        else if (b != undefined) return "white";
        else return false;
    }

    this.checkTimes =  setInterval(function(game){
        if (game.times["white"] < 0 && game.times["white"] > -42){
            game.times["white"] = -42;
            game.setStatus("B-WIN");
            if (game.blackWebSocket != "placeholder") f.sendResult(game.blackWebSocket, "WIN");
            if (game.whiteWebSocket != "placeholder") f.sendResult(game.whiteWebSocket, "LOSS");
            
        }
        else if (game.times["black"] < 0 && game.times["black"] > -42){
            game.times["black"] = -42;
            game.setStatus("W-WIN");
            if (game.blackWebSocket != "placeholder") f.sendResult(game.blackWebSocket, "LOSS");
            if (game.whiteWebSocket != "placeholder") f.sendResult(game.whiteWebSocket, "WIN");
        }
    }, 1000, this)

    //promoto a piece
    this.promotePiece = function(position){
        var oldP = this.board()[position[0]][position[1]];
        if (oldP.color == "white"){
            const index = this.whiteAlive.indexOf(oldP.name);
            if (index > -1) {//remove from alive and add the queen
                this.whiteAlive.splice(index, 1);
                this.whiteAlive.push("qw");
            }
        }
        else{
            const index = this.blackAlive.indexOf(oldP.name);
            if (index > -1) {//remove from alive and add the queen
                this.blackAlive.splice(index, 1);
                this.blackAlive.push("qb");
            }            
        }
        this.boardObj.promote(position);
        this.board()[position[0]][position[1]].setBoard(this.board());
    }

    //initalize pieces
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
    console.log(game.validateMove([0,6], [0,5]));
    game.movePiece([0,6], [0,5]);
    console.log(game.validateMove([1,7], [0,5]));
    console.table(game.board());
    game.promotePiece([0,0]);
    console.table(game.board());
    console.log(game.board()[0][0]);
}
