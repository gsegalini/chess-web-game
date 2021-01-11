function sendmessage(socket, message){
    socket.send(JSON.stringify(message));
}


export function sendMove(socket, start, end){
    let object = {
        type: Messages.T_POSSIBLE_MOVE,
        data = [start, end]
    }
    sendmessage(socket, object);
}