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
     * client to server: offering draw
     */
    exports.T_OFFER_DRAW = "OFFER-DRAW";
    exports.O_OFFER_DRAW = {
        type: exports.T_OFFER_DRAW,
        data: null
    };

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
    exports.O_CONFIERMED_MOVE = {
        type: exports.T_CONFIRMED_MOVE,
        data: null
    }

    /**
    * Server to client: abort game (e.g. if second player exited the game or abort before start)
    */
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
        data: null
    };//data is color

})(typeof exports === "undefined" ? (this.Messages = {}) : exports);