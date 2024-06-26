"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var appElement = document.getElementById("app");
var boardElement = document.getElementById("board");
var ROW_COUNT = 3;
var COL_COUNT = 3;
var boardState = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""]
];
var currentMove = "X";
var winner = "";
function createCell(row, col, content) {
    if (content === void 0) { content = ""; }
    var cell = document.createElement("button");
    cell.setAttribute("data-row", row.toString());
    cell.setAttribute("data-col", col.toString());
    cell.setAttribute("data-content", content);
    cell.classList.add("cell");
    cell.addEventListener("click", function () {
        if (winner)
            return;
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
function flattenBoard(board) {
    return board.reduce(function (acc, row) { return acc.concat(row); }, []);
}
function checkBoard(player) {
    var flattenedBoard = flattenBoard(boardState);
    if (flattenedBoard.filter(function (c) { return c; }).length === 9) {
        return "Draw";
    }
    var horizontal = [0, 3, 6].map(function (c) { return [c, c + 1, c + 2]; });
    var vertical = [0, 1, 2].map(function (c) { return [c, c + 3, c + 6]; });
    var diagonal = [
        [0, 4, 8],
        [2, 4, 6]
    ];
    var allWins = __spreadArray(__spreadArray(__spreadArray([], horizontal, true), vertical, true), diagonal, true);
    var result = allWins.some(function (indices) {
        return flattenedBoard[indices[0]] === player &&
            flattenedBoard[indices[1]] === player &&
            flattenedBoard[indices[2]] === player;
    });
    if (result)
        return player;
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
    for (var i = 0; i < ROW_COUNT; i++) {
        for (var j = 0; j < COL_COUNT; j++) {
            var cell = createCell(i, j, boardState[i][j]);
            console.log("Appending cell at row ".concat(i, ", col ").concat(j));
            boardElement.appendChild(cell);
        }
    }
    var oldMoveElement = document.getElementById("move-element");
    if (oldMoveElement) {
        oldMoveElement.remove();
    }
    var moveElement = document.createElement("p");
    moveElement.id = "move-element";
    moveElement.innerText = winner
        ? "Winner: ".concat(winner)
        : "Next Move: ".concat(currentMove);
    moveElement.classList.add("current-move");
    var resetButton = document.getElementById("reset");
    if (resetButton) {
        appElement.insertBefore(moveElement, resetButton);
    }
    else {
        appElement.appendChild(moveElement);
    }
}
function init() {
    var resetButton = document.getElementById("reset");
    if (!resetButton) {
        throw new Error("No Reset button");
    }
    resetButton.addEventListener("click", function () {
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
}
else {
    throw new Error("Required elements are missing in the DOM");
}
