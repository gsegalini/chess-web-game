
window.addEventListener('load', function () {
  drawGameStart();

  const min1 = document.getElementById("1min");
  const v1 = document.getElementById("1v1");
  const min5 = document.getElementById("5min");
  const v5 = document.getElementById("5v5");
  const min10 = document.getElementById("10min");
  const v10 = document.getElementById("10v10");
  const play = document.getElementById("play-button-real");

  const premoves = document.getElementById("premoves");
  const clicks = document.getElementById("clicks");
  const sound = document.getElementById("sound");

  min1.addEventListener("click", function(){setRule("1min")});
  v1.addEventListener("click", function(){setRule("1v1")});
  min5.addEventListener("click", function(){setRule("5min")});
  v5.addEventListener("click", function(){setRule("5v5")});
  min10.addEventListener("click", function(){setRule("10min")});
  v10.addEventListener("click", function(){setRule("10v10")});
  play.addEventListener("click", checkAndPlay)

  premoves.addEventListener("change", changePremove);
  clicks.addEventListener("change", changeClick);
  sound.addEventListener("change", changeSound);
  
  const optionsSet = JSON.parse(window.localStorage.getItem('optionsGame'));

  if(optionsSet != null) {
    options.sound = optionsSet.sound;
    options.premove = optionsSet.premove;
    options.clickMove = optionsSet.clickMove;
  
    premoves.checked = optionsSet.premove;
    clicks.checked = optionsSet.clickMove;
    sound.checked = optionsSet.sound;
  }


  console.log(options);
});


// Puts the visual pieces on the board
function drawGameStart() {
  let htmlBoard = document.getElementById("chess-board");
  let i = 0;
  let y = 0;
  let x = 0;
  const board = createBoard(new Array(), new Array());
  // Checks which side

  for (row of board) {

    // Creates the row element
    const htmlRow = document.createElement("div");
    htmlRow.classList.add("row");
    y = 0;

    for (column of row) {

      // makes blocks
      const htmlColumn = document.createElement("div");
      htmlColumn.classList.add("column");
      const id = String(x) + String(y);
      htmlColumn.setAttribute("id", id);
      if (i % 2 == 0) {
        htmlColumn.classList.add("white-block");
      }

      // makes piece
      if (column != "") {
        const htmlImage = document.createElement("IMG");
        htmlImage.classList.add("piece");
        htmlImage.style.position = "absolute";
        htmlImage.style.zIndex = "10"
        htmlImage.style.left = x * 75 + "px";
        htmlImage.style.top = y * 75 + "px";
        htmlImage.classList.add(column.name);
        htmlImage.setAttribute('draggable', false);

        // gives the html attributes to the piece
        column.htmlPosition = [(x * 75 + "px"), (y * 75 + "px")];
        column.htmlRef = htmlImage;

        // Import images
        const color = column.color;
        const piece = lookup[column.name];
        const loc = "images/" + color + "_" + piece + ".svg";

        htmlImage.setAttribute("src", loc);


        htmlColumn.appendChild(htmlImage);
      }

      htmlRow.appendChild(htmlColumn);
      i++;
      y++;

    }
    i++;
    htmlBoard.appendChild(htmlRow);
    x++;

  }


}


function setRule(rule) {
  // removes the other border
  document.querySelectorAll(".focused-button").forEach(e => e.classList.remove("focused-button"));
  // adds border
  document.getElementById(rule).classList.add("focused-button");

  var d = new Date();
  d.setTime(d.getTime() + (10*1000));
  var expires = "expires="+ d.toUTCString();
  document.cookie = "rules=" + rule + ";" + expires + ";path=/;SameSite=Lax";
}

function checkAndPlay(){
  let cookieV = document.cookie.split('; ');
  cookieV = cookieV.find(row => row.startsWith('rules='));
  if (cookieV == undefined) return;
  console.log(cookieV);
  location.href = "game";
}