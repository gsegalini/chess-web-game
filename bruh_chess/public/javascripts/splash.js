
window.addEventListener('load', function () {
  drawGameStart();

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