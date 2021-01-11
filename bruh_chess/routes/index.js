var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.sendFile("splash.html", {root: "./public"});
});

router.get('/game', function(req, res) {
  res.sendFile("game.html", {root: "./public"});
});

router.get('/test', function(req, res) {
  res.sendFile("testing.html", {root: "./public"});
});

module.exports = router;
