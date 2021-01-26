function component () {
  const element = document.createElement('div');
  console.log('woo------------------------');
  element.innerHTML = `its webpack setup`;
  return element;
}

document.appendChild(component())