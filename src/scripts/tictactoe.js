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
      !isFromAi && setTimeout(aiPlayerTurn, 100);
    }
  }
}
function posArrToBin(arr) {
  let pl = 0b000000000;
  arr.forEach((pos) => {
    if (pos !== null) {
      pl |= 1 << pos;
    }
  });
  return pl;
}


function checkPlayerStatus(playerPositions, other) {
  let player = posArrToBin(playerPositions);
  return isWinner(player, other);
}

function isWinner(player, other = []) {
  let otherPl = posArrToBin(other);
  for (let condition of winingCombinations) {
    if ((player & condition) == condition) {
      return {
        status: 'win',
        condition,
        player
      };
    }
    if((otherPl & condition) == condition) {
      return {
        status: 'win',
        condition,
        player: otherPl
      };
    }
  }
  if (other && (player | otherPl) === 0b111111111) {
    return {
      status: 'draw',
      player,
    };
  }
  return {
    status: 'cont',
    player,
  };
}
function getScore(board, depth, isBot) {
  var { ai, h, board } = board;
  var {status, player} = checkPlayerStatus(ai, h);
  
  if (/(win)|(draw)/.test(status)) {
    var sc = (status === 'win' &&  posArrToBin(h) === player) ? -10 : status === 'draw' ? 0 : 10;
    return sc;
  }
  if (isBot) {
    var bestScore = -Infinity;
    for (var i = 0; i < 9; i++) {
      var cp = 8 - i;
      if (board[cp] === '0') {
        board[cp] = '1';
        ai.push(i);
        let score = getScore(
          {
            ai,
            h,
            board,
          },
          depth + 1,
          false,score
        );
        ai.pop();
        board[cp] = '0';
        bestScore = Math.max(bestScore, score);
      }
    }
    return bestScore;
  } else {
    var bestScore = Infinity;
    for (var i = 0; i < 9; i++) {
      var cp = 8 - i;
      if (board[cp] === '0') {
        board[cp] = '1';
        h.push(i);
        let score = getScore(
          {
            ai,
            h,
            board,
          },
          depth + 1,
          true,score
        );
        h.pop();
        board[cp] = '0';
        bestScore = Math.min(bestScore, score);
      }
    }
    return bestScore;
  }
}

function bestMove(boardlog) {
  var bestScore = -Infinity;
  var move;
  var { ai, h, board } = boardlog;
  for (var i = 0; i < 9; i++) {
    var cp = 8 - i;
    if (board[cp] === '0') {
      if (ai.length === 0) {
        return board[4] === '0' ? 4 : i;
      }
      board[cp] = '1';
      ai.push(i);
      var score = getScore(
        {
          ai,
          h,
          board,
        },
        0,
        false,
      );
      ai.pop();
      board[cp] = '0';
      if (bestScore < score) {
        bestScore = score;
        move = i;
      }
    }
  }
  console.log(';move', move);
  return move;
}

function getPosFromStr(str) {
  return str
    .split('')
    .map((el, i) => (el === '1' ? Math.abs(i - 8) : null))
    .filter((el) => el !== null);
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
  const move = bestMove(
    {
      h: getPosFromStr(numToBinStr(playerCross)),
      ai: getPosFromStr(numToBinStr(playerCircle)),
      board: numToBinStr(fullBoard).split(''),
    },
    true,
  );
  cells[move].classList.add(className);

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
