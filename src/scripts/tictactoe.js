import '../styles/tictactoe.scss';

let isPlayerX = true;
const players = document.querySelectorAll('.playerNames');
const cells = document.querySelectorAll('.gameCells');

const winingCombinations = [
  0b111000000,
  0b000111000,
  0b000000111,
  0b100100100,
  0b010010010,
  0b001001001,
  0b100010001,
  0b001010100,
];

function checkPlayerStatus(playerPositions) {
  let playerX = 0b000000000;
  let playerO = 0b000000000;
  playerPositions.forEach(pos => {
    // if (cell.classList.contains('cross')) {
    //   playerX |= 1 << index;
    // }
    // if (cell.classList.contains('circle')) {
    //   playerO |= 1 << index;
    // }
  });
  for (let condition of winingCombinations) {
    if ((playerX & condition) == condition) {
      return {
        status: 'complete',
        winner: 'cross',
        condition,
      };
    }
    if ((playerO & condition) == condition) {
      return {
        status: 'complete',
        winner: 'circle',
        condition,
      };
    }
  }
  if ((playerX | playerO) == 0b111111111) {
    return {
      status: 'draw',
    };
  }
  return {
    status: 'cont',
  };
}

function updatePlayerStatus() {
  const active = document.querySelector('.playerNames.active');
  players.forEach((player) => {
    if (player === active) {
      player.classList.remove('active');
    } else {
      player.classList.add('active');
    }
  });
  isPlayerX = !isPlayerX;
}

function reset() {
  cells.forEach((cell) => {
    cell.classList.remove('cross');
    cell.classList.remove('circle');
  });
  players.forEach((player, index) => {
    if (index === 0) {
      player.classList.add('active');
    } else {
      player.classList.remove('active');
    }
  });
  document.querySelector('.buttonContainer').style.display = 'none';
  const board = document.querySelector('.gameGrid');
  board.addEventListener('click', boardClickListener);
  board.style.setProperty('--win-condition', '');
}

function updateWinners(gameState) {
  const scoreContainer = document.querySelector(`.${gameState.winner} .score`);
  const score = parseInt(scoreContainer.innerText);
  scoreContainer.innerText = score + 1;

  console.log(gameState.condition);
  const board = document.querySelector('.gameGrid');
  board.style.setProperty('--win-condition', gameState.condition);
  enableReset();
}

function aiPlayerTurn() {
  // basic version
  const className = isPlayerX ? 'cross' : 'circle';
  const cells = document.querySelectorAll(
    '.gameCells:not(.cross):not(.circle)',
  );
  const newPosition = Math.floor(Math.random() * cells.length);

  console.log('AI - POS - ', cells.length, newPosition, className);
  cells[newPosition].classList.add(className);
  updateBoard(true);
}

function optimalScore() {}

function enableReset() {
  const board = document.querySelector('.gameGrid');
  board.removeEventListener('click', boardClickListener);
  document.querySelector('.buttonContainer').style.display = 'grid';
}

function updateBoard(isFromAi) {
  const gameState = checkGameStatus();
  const { status } = gameState;
  switch (status) {
    case 'complete':
      updateWinners(gameState);
      break;
    case 'draw':
      enableReset();
      break;
    case 'cont':
      updatePlayerStatus();
      !isFromAi && setTimeout(aiPlayerTurn, 10);
      break;
  }
}
function boardClickListener(evt) {
  const classes = evt.target.className.toLowerCase();
  if (classes.indexOf('gamecells') !== -1) {
    if (classes.match(/(cross)|(circle)/)) {
      return;
    }
    evt.target.classList.add(isPlayerX ? 'cross' : 'circle');
    updateBoard();
  }
}

function Tictactoe() {
  isPlayerX = true;
  document.querySelector('.resetButton').addEventListener('click', reset);
  reset();
}

Tictactoe();
