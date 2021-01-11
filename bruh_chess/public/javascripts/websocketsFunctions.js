function sendmessage(socket, message){
    socket.send(JSON.stringify(message));
}


export function sendMove(socket, start, end){
    let object = Messages.O_POSSIBLE_MOVE;
    object.data = [start, end];
    sendmessage(socket, object);
}

export function sendDraw(socket, color){
    let object = Messages.O_OFFER_DRAW;
    object.data = color;
    sendmessage(socket, object);
}

export function sendResign(socket, color){
    let object = Messages.O_RESIGN;
    object.data = color;
    sendmessage(socket, object);
}