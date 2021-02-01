import '../styles/tictactoe.scss';

let isPlayerX = true;
const players = document.querySelectorAll('.playerNames');
const cells = document.querySelectorAll('.gameCells');
const winingCombinations = [
  '7',
  '70',
  '700',
  '111',
  '222',
  '444',
  '124',
  '421',
];

function checkGameStatus() {
  let xVals = '',
    oVals = '';
  cells.forEach((cell) => {
    if (cell.classList.contains('cross')) {
      xVals += 1;
    } else {
      xVals += 0;
    }
    if (cell.classList.contains('circle')) {
      oVals += 1;
    } else {
      oVals += 0;
    }
  });
  console.log(xVals, oVals);
  xVals = parseInt(xVals, 2).toString(8);
  oVals = parseInt(oVals, 2).toString(8);
  console.log(xVals, oVals);
  if (winingCombinations.find((val) => val === xVals)) {
    console.log('X wins....');
  }
  if (winingCombinations.find((val) => val === oVals)) {
    console.log('O wins....');
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
}

function playerTurn(evt) {
  const classes = evt.target.className.toLowerCase();
  if (!classes.match(/(cross)|(circle)/)) {
    evt.target.classList.add(isPlayerX ? 'cross' : 'circle');
  }
  checkGameStatus();
  updatePlayerStatus();
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
}

function Tictactoe() {
  isPlayerX = true;
  const board = document.querySelector('.gameGrid');
  board.addEventListener('click', playerTurn);
}

Tictactoe();
