function gamePiece(name, color, moveFunction, startPosition){
    this.name = name;
    this.color = color;
    this.move = moveFunction;
    this.moved = 0;
    this.position = startPosition;

    this.getName = function(){return this.name};
    this.increaseMoved = function(){this.moved++};
    this.setPosition = function(x,y){this.position = [x,y]};
    this.getMoves = function(){return this.move(this.position[0], this.position[1], this.color, this.moved)};
}

function pawnMove(x, y, color, moved){
    if (color === "white"){
        if (moved > 0){
            return [[x, y+1]];
        }
        else {
            return [[x, y+1], [x, y+2]];
        }
    }
    else{
        if (moved > 0){
            return [[x, y-1]];
        }
        else {
            return [[x, y-1], [x, y-2]];
        }
    }
}

function pawn(name, color){
    return new gamePiece(name, color, pawnMove)
}