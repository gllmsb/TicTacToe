const appElement = document.getElementById("app");
const boardElement = document.getElementById("board");
const ROW_COUNT = 3;
const COL_COUNT = 3;

type Cell = "X" | "O" | "";
type Board = [[Cell, Cell, Cell], [Cell, Cell, Cell], [Cell, Cell, Cell]];

let boardState: Board = [
  ["", "", ""],
  ["", "", ""],
  ["", "", ""]
];

let currentMove: "X" | "O" = "X";
let winner: Cell | "Draw" = "";

function createCell(row: number, col: number, content = ""): HTMLButtonElement {
  const cell = document.createElement("button");
  cell.setAttribute("data-row", row.toString());
  cell.setAttribute("data-col", col.toString());
  cell.setAttribute("data-content", content);
  cell.classList.add("cell");
  cell.addEventListener("click", () => {
    if (winner) return;
    if (boardState[row][col] === "") {
      boardState[row][col] = currentMove;
      winner = checkBoard(currentMove);

      if (!winner) {
        currentMove = currentMove === "X" ? "O" : "X";
      }

      renderBoard();
    }
  });
  return cell;
}

function flattenBoard(board: Board): Cell[] {
  return board.reduce((acc, row) => acc.concat(row), [] as Cell[]);
}

function checkBoard(player: Cell): Cell | "Draw" {
  const flattenedBoard = flattenBoard(boardState);
  if (flattenedBoard.filter((c) => c).length === 9) {
    return "Draw";
  }
  const horizontal = [0, 3, 6].map((c) => [c, c + 1, c + 2]);
  const vertical = [0, 1, 2].map((c) => [c, c + 3, c + 6]);
  const diagonal = [
    [0, 4, 8],
    [2, 4, 6]
  ];

  const allWins = [...horizontal, ...vertical, ...diagonal];
  let result = allWins.some(
    (indices) =>
      flattenedBoard[indices[0]] === player &&
      flattenedBoard[indices[1]] === player &&
      flattenedBoard[indices[2]] === player
  );
  if (result) return player;
  return "";
}

function renderBoard() {
  if (!appElement) {
    throw new Error("Cannot find app element");
  }
  if (!boardElement) {
    throw new Error("Cannot find board element");
  }
  boardElement.innerHTML = "";
  for (let i = 0; i < ROW_COUNT; i++) {
    for (let j = 0; j < COL_COUNT; j++) {
      const cell = createCell(i, j, boardState[i][j]);
      console.log(`Appending cell at row ${i}, col ${j}`);
      boardElement.appendChild(cell);
    }
  }
  const oldMoveElement = document.getElementById("move-element");
  if (oldMoveElement) {
    oldMoveElement.remove();
  }
  const moveElement = document.createElement("p");
  moveElement.id = "move-element";
  moveElement.innerText = winner
    ? `Winner: ${winner}`
    : `Next Move: ${currentMove}`;
  moveElement.classList.add("current-move");
  const resetButton = document.getElementById("reset");
  if (resetButton) {
    appElement.insertBefore(moveElement, resetButton);
  } else {
    appElement.appendChild(moveElement);
  }
}

function init() {
  const resetButton = document.getElementById("reset");
  if (!resetButton) {
    throw new Error("No Reset button");
  }
  resetButton.addEventListener("click", () => {
    boardState = [
      ["", "", ""],
      ["", "", ""],
      ["", "", ""]
    ];
    currentMove = "X";
    winner = "";
    renderBoard();
  });
  renderBoard();
}

if (appElement && boardElement) {
  init();
} else {
  throw new Error("Required elements are missing in the DOM");
}