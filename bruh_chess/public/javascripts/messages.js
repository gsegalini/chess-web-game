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
    * Server to client or client to server: abort game (e.g. if second player exited the game or abort before start)
    */
   exports.T_GAME_ABORT = "GAME-ABORTED";
    exports.O_GAME_ABORTED = {
        type: "GAME-ABORTED"
        };
    exports.S_GAME_ABORTED = JSON.stringify(exports.O_GAME_ABORTED);

    /**
     * Server to client: your turn
     */
    exports.O_TURN = { type: "YOUR-TURN" };
    exports.S_TURN = JSON.stringify(exports.O_TURN);

    /**
     * client to server: resign
     */
    exports.T_RESIGN = "RESIGN";
    exports.O_RESIGN = {
        type: exports.T_RESIGN,
    };//data is color

    /**
     * server to client: you won/lost
     */
    exports.T_RESULT = "RESULT";
    exports.O_RESULT = {
        type: exports.T_RESULT,
        data: null
    }//data is won/loss

})(typeof exports === "undefined" ? (this.Messages = {}) : exports);