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
    if (color === "white"){
        if (moved > 0){
            return [[x, y+1], [x+1, y+1], [x-1, y+1]];
        }
        else {
            return [[x, y+1], [x, y+2], [x+1, y+1], [x-1, y+1]];
        }
    }
    else{
        if (moved > 0){
            return [[x, y-1], [x+1, y-1], [x-1, y-1]];
        }
        else {
            return [[x, y-1], [x, y-2],[x+1, y-1], [x-1, y-1]];     //this includes cases where i can eat with pawn
        }
    }
}

function pawn(name, color, startPosition){
    return new gamePiece(name, color, pawnMove, startPosition)
}

function bishopMove(x, y, color, moved){
    let possibles = [];
    for (var i = -7;i<=7;i++){
        if (i == 0){continue;}
        let actual1 = [x+i, y+i];
        let actual2 = [x+i, y-i];

        if (actual1[0] < 8 && actual1[0] >= 0 && actual1[1] < 8 && actual1[1] >= 0){possibles.push(actual1);}
        if (actual2[0] < 8 && actual2[0] >= 0 && actual2[1] < 8 && actual2[1] >= 0){possibles.push(actual2);}
    }
    return possibles;
}

function bishop(name, color, startPosition){
    return new gamePiece(name, color, bishopMove, startPosition);
}

function rookMove(x, y, color, moved){
    let possibles = [];
    for (var i = -7;i<=7;i++){
        if (i == 0){continue;}
        let actual1 = [x, y+i];
        let actual2 = [x+i, y];

        if (actual1[1] < 8 && actual1[1] >= 0){possibles.push(actual1);}
        if (actual2[0] < 8 && actual2[0] >= 0){possibles.push(actual2);}
    }
    return possibles;
}

function rook(name, color, startPosition){
    return new gamePiece(name, color, rookMove, startPosition);
}

function knightMove(x, y, color, moved){
    let possibles = [];
    let pairs = [[2,1], [2,-1], [-1,2], [-2,-1]];

    for (var i = 0;i<4;i++){
        let actual = [x+pairs[i][0], y + pairs[i][1]];
        if (actual[0] < 8 && actual[0] >= 0 && actual[1] < 8 && actual[1] >= 0) {possibles.push(actual);}
    }
    return possibles;
}


if (require.main === module) {
    let t = new rook("test", "white", [3,3]);
    console.log(t.name);
    console.log(t.getMoves());
    t.setPosition(4,7);
    console.log(t.getMoves());
}