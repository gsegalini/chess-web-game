module.exports = functions;

var messages = require("./public/javascripts/messages");


function functions(){
    this.sendmessage = function(socket, message){
        socket.send(JSON.stringify(message));
    }

    this.sendConfirmedMove = function(socket, start, end){
        let object = messages.O_CONFIRMED_MOVE;
        object.data = [start, end];
        this.sendmessage(socket, object);
    }

    this.sendDraw = function (socket){
        let object = messages.O_OFFER_DRAW;
        this.sendmessage(socket, object);
    }

    this.abortGame = function (socket){
        this.sendmessage(socket, messages.O_GAME_ABORTED);
    }

    this.sendTurn = function (socket){
        this.sendmessage(socket, messages.O_TURN);
    }

    this.sendResult = function(socket, result){
        let object = messages.O_RESULT;
        object.data = result;
        this.sendmessage(socket, object);
    }

    this.sendReject = function(socket){
        this.sendmessage(socket, messages.O_REJECTED_MOVE);
    }
}