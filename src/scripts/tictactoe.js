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
  console.log(playerPositions);
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

function optimalPos(board) {
  let bestScore = -Infinity;
  let move;
  const boardArr = board.fullBoard;
  for (let i = 0; i < boardArr.length; i++) {
    if (boardArr[i] === '0') {
      board.ai = [...board.ai, Math.abs(i - 8)];
      board.fullBoard[i] = '1';
      let score = minMax({ ...board }, 0, false);
      board.fullBoard[i] = '0';
      board.ai.pop();
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }
  return move;
}
let counts = 0;
function minMax(board, depth, isMaximizing) {
  console.log('minMax', isMaximizing, board.x, board.ai);
  let result = isMaximizing
    ? checkPlayerStatus(board.ai)
    : checkPlayerStatus(board.x);
  console.log('status',isMaximizing, result.status);
  if (result.status !== 'cont') {
    return isMaximizing ? 10 : -10;
  }
  if (++counts > 5) return 0;
  let bestScore = Infinity * (isMaximizing ? -1 : 1);
  const boardArr = [...board.fullBoard];
  console.log(boardArr);
  if (isMaximizing) {
    for (let i = 0; i < boardArr.length; i++) {
      if (boardArr[i] === '0') {
        board.ai = [...board.ai, Math.abs(i - 8)];
        board.fullBoard[i] = '1';
        let score = minMax({ ...board }, depth + 1, false);
        board.fullBoard[i] = '0';
        board.ai.pop();
        bestScore = Math.max(score, bestScore);
      }
    }
  } else {
    for (let i = 0; i < boardArr.length; i++) {
      if (boardArr[i] === '0') {
        board.x = [...board.x, Math.abs(i - 8)];
        board.fullBoard[i] = '1';
        let score = minMax({ ...board }, depth + 1, true);
        board.fullBoard[i] = '0';
        board.x.pop();
        bestScore = Math.min(score, bestScore);
      }
    }
  }
  console.log(bestScore);
  return bestScore;
}

function getPosFromStr(str) {
  return str
    .split('')
    .map((el, i) => (el === '1' ? Math.abs(i - 8) : null))
    .filter(Boolean);
}

function numToBinStr(num) {
  const str = num.toString(2);
  return '000000000'.substr(str.length) + str;
}
function aiPlayerTurn() {
  // basic version
  const className = isPlayerX ? 'cross' : 'circle';
  const cells = document.querySelectorAll('.gameCells');
  const fullBoard = playerCross | playerCircle;
  console.log(playerCross, playerCircle);
  const move = optimalPos(
    {
      x: getPosFromStr(numToBinStr(playerCross)),
      ai: getPosFromStr(numToBinStr(playerCircle)),
      fullBoard: numToBinStr(fullBoard).split('').reverse(),
    },
    true,
  );
  console.log('move', move);
  cells[move].classList.add(className);
  // const newPosition = Math.floor(Math.random() * cells.length);
  // cells[newPosition].classList.add(className);

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
