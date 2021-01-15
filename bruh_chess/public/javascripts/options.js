const options = {
    sound:false,
    premove:false,
    clickMove:false,
}

const lookup = {
    rb1: "rook",
    rb0: "rook",
    rw0: "rook",
    rw1: "rook",
    kb1: "knight",
    kb0: "knight",
    kw0: "knight",
    kw1: "knight",
    bb1: "bishop",
    bb0: "bishop",
    bw0: "bishop",
    bw1: "bishop",
    kw: "king",
    kb: "king",
    qw: "queen",
    qb: "queen",
    pb0: "pawn",
    pw0: "pawn",
    pb1: "pawn",
    pw1: "pawn",
    pb2: "pawn",
    pw2: "pawn",
    pb3: "pawn",
    pw3: "pawn",
    pb4: "pawn",
    pw4: "pawn",
    pb5: "pawn",
    pw5: "pawn",
    pb6: "pawn",
    pw6: "pawn",
    pb7: "pawn",
    pw7: "pawn",
  }

  const letterLookup = {
    rb1: "R",
    rb0: "R",
    rw0: "R",
    rw1: "R",
    kb1: "N",
    kb0: "N",
    kw0: "N",
    kw1: "N",
    bb1: "B",
    bb0: "B",
    bw0: "B",
    bw1: "B",
    kw: "K",
    kb: "K",
    qw: "Q",
    qb: "Q",
    pb0: "",
    pw0: "",
    pb1: "",
    pw1: "",
    pb2: "",
    pw2: "",
    pb3: "",
    pw3: "",
    pb4: "",
    pw4: "",
    pb5: "",
    pw5: "",
    pb6: "",
    pw6: "",
    pb7: "",
    pw7: "",
  }

  const xLookup = {
    0: "a",
    1: "b",
    2: "c",
    3: "d",
    4: "e",
    5: "f",
    6: "g",
    7: "h",
  }



function changeSound(){
  options.sound = !options.sound; 
  console.log(options);
}

function changePremove(){
  options.premove = !options.premove; 
  console.log(options);
}

function changeClick(){
  options.clickMove = !options.clickMove; 
  console.log(options);
}


function toggleRules() {
  var popup = document.getElementById("questionPopup");
  popup.classList.toggle("show");
}