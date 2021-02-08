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

let playerCross = 0b000000000;
let playerCircle = 0b000000000;

function enableReset() {
  const board = document.querySelector('.gameGrid');
  board.removeEventListener('click', boardClickListener);
  document.querySelector('.buttonContainer').style.display = 'grid';
}

function updateGameStatus(playerPositions, isFromAi) {
  const gameState = checkPlayerStatus(playerPositions);
  const { status, player } = gameState;
  if (status === 'win') {
    updateWinners({ ...gameState, winner: isPlayerX ? 'cross' : 'circle' });
  } else {
    if (isPlayerX) {
      playerCross = player;
    } else {
      playerCircle = player;
    }
    if ((playerCircle | playerCross) === 0b111111111) {
      enableReset();
      return false;
    } else {
      updatePlayerStatus();
      !isFromAi && setTimeout(aiPlayerTurn, 10);
    }
  }
}

function checkPlayerStatus(playerPositions) {
  let player = 0b000000000;
  playerPositions.forEach((pos) => {
    if (pos !== null) {
      player |= 1 << pos;
    }
  });
  return isWinner(player);
}

function isWinner(player) {
  for (let condition of winingCombinations) {
    if ((player & condition) == condition) {
      return {
        status: 'win',
        condition,
      };
    }
  }
  return {
    status: 'cont',
    player,
  };
}

function optimalPos(board, currentPlayer) {
  let score;
  const {cells, x : playerCross, o:playerCircle, fullBoard} = board;
  if (cells.length === 1) {
    const status = checkPlayerStatus('circle', currentPlayer).status;
    score = status === 'cont' ? 0 : currentPlayer ? 1 : -1;
    return score;
    
  }
  const scores = [];
  for (let i = 0; i < cells.length; i++) {
    if(currentPlayer) {
      scores[i] = optimalPos([], true)
    } else {

    }
    scores[i] = optimalPos([empty[i]], !currentPlayer)
  }
  console.log(scores);
}

function aiPlayerTurn() {
  // basic version
  const className = isPlayerX ? 'cross' : 'circle';
  const cells = document.querySelectorAll(
    '.gameCells:not(.cross):not(.circle)',
  );
  const fullBoard = playerCross | playerCircle;
  console.log(playerCross, playerCircle, (fullBoard>>>0).toString(2));
  optimalPos({playerCross, playerCircle, fullBoard, cells}, true);
  const newPosition = Math.floor(Math.random() * cells.length);

  console.log('AI - POS - ', cells.length, newPosition, className);
  cells[newPosition].classList.add(className);

  const pos = [];
  document
    .querySelectorAll(`.${className}`)
    .forEach((el) => pos.push(el.getAttribute('data-index')));
  updateGameStatus(pos, true);
}

function boardClickListener(evt) {
  const classes = evt.target.className.toLowerCase();
  if (classes.indexOf('gamecells') !== -1) {
    if (classes.match(/(cross)|(circle)/)) {
      return;
    }
    const className = isPlayerX ? 'cross' : 'circle';
    evt.target.classList.add(className);
    const pos = [];
    document
      .querySelectorAll(`.${className}`)
      .forEach((el) => pos.push(el.getAttribute('data-index')));
    updateGameStatus(pos, false);
  }
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

function updateWinners(gameState) {
  const scoreContainer = document.querySelector(`.${gameState.winner} .score`);
  const score = parseInt(scoreContainer.innerText);
  scoreContainer.innerText = score + 1;

  const board = document.querySelector('.gameGrid');
  board.style.setProperty('--win-condition', gameState.condition);
  enableReset();
}

function reset() {
  isPlayerX = true;
  playerCircle = 0b000000000;
  playerCross = 0b000000000;
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

function Tictactoe() {
  isPlayerX = true;
  document.querySelector('.resetButton').addEventListener('click', reset);
  reset();
}

Tictactoe();
