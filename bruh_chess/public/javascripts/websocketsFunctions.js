function sendmessage(socket, message){
    socket.send(JSON.stringify(message));
}


function sendMove(socket, start, end){
    let object = Messages.O_POSSIBLE_MOVE;
    object.data = [start, end];
    sendmessage(socket, object);
}

function sendDraw(socket){
    sendmessage(socket, object);
}

function sendResign(socket){
    let object = Messages.O_RESIGN;
    sendmessage(socket, object);
}
