import '../styles/tictactoe.scss';

function Tictactoe() {
  const board = document.querySelector('.gameGrid');
  board.addEventListener('click', (evt) => {
    console.log(evt.target.classList);
  })
};

Tictactoe();