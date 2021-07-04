"use strict";

const gameBoard = (() => {
  let board = ["","","","","","","","",""];

  const markSquare = (position, player) => {
    if (position > board.length) return;
    board[position] = player;
  }

  const clear = () => {
    for (let i = 0; i < board.length; i++) {
      board[i] = "";
    }
  }

  const getField = (position) => {
    if (position > board.length) return;
    return board[position];
  };

  return {markSquare, clear, getField};
})();

const Player = (sign) => {
  this.sign = sign;
  const getSymbol = () => {return sign;};
  return {getSymbol};
};

const gamePlay = (() => {
  const playerX = Player("X");
  const playerO = Player("O");
  let isOver = false;
  let round = 1;

  const currentPlayer = () => {
    return round % 2 === 1 ? playerX.getSymbol() : playerO.getSymbol();
  };

  const playRound = (position) => {
    gameBoard.markSquare(position, currentPlayer());
    if (checkWinner(position)) {
      displayController.setResultMessage(currentPlayer());
      isOver = true;
      return;
    }

    if (round === 9) {
      displayController.setResultMessage("Draw");
      isOver = true;
      return;
    }
    round++;
    displayController.setMessageElement( 
      `Player ${currentPlayer()}'s turn`
    );
  };

  const checkWinner = (fieldIndex) => {
    const winConditions = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    return winConditions
      .filter((combination) => combination.includes(fieldIndex))
      .some((possibleCombination) =>
        possibleCombination.every(
          (index) => gameBoard.getField(index) === currentPlayer()
        )
      );
  };

  const getIsOver = () => {
    return isOver;
  };

  const reset = () => {
    round = 1;
    isOver = false;
  };

  return {playRound, getIsOver, reset};
})();

const displayController = (() => {
  const fieldElements = document.getElementsByClassName('block');
  const messageElement = document.getElementById('message');
  const restartButton = document.getElementById('restart-button');

  for (let a = 0; a < fieldElements.length; a++) {
    let field = fieldElements[a];
    field.addEventListener("click", () => {
      if(gamePlay.getIsOver() || field.querySelector("p").textContent !== "") return;
      gamePlay.playRound(a);
      updateGameboard();
    })
  }
  

  restartButton.addEventListener("click", () => {
    gameBoard.clear();
    gamePlay.reset();
    updateGameboard();
    setMessageElement("Player X's turn");
  })

  const updateGameboard = () => {
    for (let i = 0; i < fieldElements.length; i++) {
      fieldElements[i].querySelector("p").textContent = gameBoard.getField(i);   
    }
  };

  const setResultMessage = (winner) => {
    if (winner === "Draw") {
      setMessageElement("It's a draw!");
    } else {
      setMessageElement(`Player ${winner} has won!`);
    }
  };

  const setMessageElement = (message) => {
    messageElement.textContent = message;
  };

  return {setResultMessage, setMessageElement};
})();