(function(exports){
    /**
     * server to client: set as white
     */
    exports.T_PLAYER_COLOR = "PLAYER-COLOR";
    exports.O_PLAYER_WHITE = {
        type: exports.T_PLAYER_COLOR,
        data: "white"
    }
    exports.S_PLAYER_WHITE = JSON.stringify(exports.O_PLAYER_WHITE);

    /**
     * server to client: set as black
     */
    exports.O_PLAYER_BLACK = {
        type: exports.T_PLAYER_COLOR,
        data: "black"
    }
    exports.S_PLAYER_BLACK = JSON.stringify(exports.O_PLAYER_BLACK);

    /**
     * client to server and server to other client: offering draw
     */
    exports.T_OFFER_DRAW = "OFFER-DRAW";
    exports.O_OFFER_DRAW = {
        type: exports.T_OFFER_DRAW,
    };
    exports.S_OFFER_DRAW = JSON.stringify(exports.O_OFFER_DRAW);

    /**
     * client to server: move from client
     */
    exports.T_POSSIBLE_MOVE = "POSSIBLE-MOVE";
    exports.O_POSSIBLE_MOVE = {
        type: exports.T_POSSIBLE_MOVE,
        data: null
    }
    //no exports as data need to have the move

    /**
     * server to both client: move from server to update board
     */
    exports.T_CONFIRMED_MOVE = "CONFIRMED-MOVE";
    exports.O_CONFIRMED_MOVE = {
        type: exports.T_CONFIRMED_MOVE,
        data: null
    }

    /**
     * server to client: rejected move for cheaters
     */
    exports.T_REJECTED_MOVE = "REJECTED-MOVE";
    exports.O_REJECTED_MOVE = {
        type: exports.T_REJECTED_MOVE
    }
    exports.S_REJECTED_MOVE = JSON.stringify(exports.O_REJECTED_MOVE);

    /**
    * Server to client or client to server: abort game (e.g. if second player exited the game or abort before start)
    */
    exports.T_GAME_ABORT = "GAME-ABORTED";
    exports.O_GAME_ABORTED = {
        type: "GAME-ABORTED"
    };
    exports.S_GAME_ABORTED = JSON.stringify(exports.O_GAME_ABORTED);

    /**
     * Server to client: start
     */
    exports.O_START = { type: "START" };

    /**
     * client to server: resign
     */
    exports.T_RESIGN = "RESIGN";
    exports.O_RESIGN = {
        type: exports.T_RESIGN,
    };

    /**
     * server to client: you won/lost
     */
    exports.T_RESULT = "RESULT";
    exports.O_RESULT = {
        type: exports.T_RESULT,
        data: null
    };//data is won/loss


    /**
     * client to server and server to other client: accept draw
     */
    exports.T_ACCEPT_DRAW = "ACCEPT-DRAW";
    exports.O_ACCEPT_DRAW = {
        type: exports.T_ACCEPT_DRAW,
    };
    exports.S_ACCEPT_DRAW = JSON.stringify(exports.O_ACCEPT_DRAW);

    /**
     * client to server and server to other client: reject draw
     */
    exports.T_REJECT_DRAW = "ACCEPT-DRAW";
    exports.O_REJECT_DRAW = {
        type: exports.T_REJECT_DRAW,
    };
    exports.S_REJECT_DRAW = JSON.stringify(exports.O_REJECT_DRAW);

    /**
     * server to clients: update timers
     */
    exports.T_UPDATE_TIMER = "UPDATE-TIMER";
    exports.O_UPDATE_TIMER = {
        type: exports.T_UPDATE_TIMER,
        data: null
    }
    //data is player color and remaining time

})(typeof exports === "undefined" ? (this.Messages = {}) : exports);