import './styles/main.scss';

function component () {
  const element = document.createElement('div');
  element.innerHTML = `its webpack setup`;
  return element;
}

document.appendChild(component())