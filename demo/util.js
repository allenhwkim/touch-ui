/* eslint-disable */
function setBgText(el, text) {
  let str = ['url("data:image/svg+xml;utf8,',
    "<svg xmlns='http://www.w3.org/2000/svg' version='1.1' height='100%' width='100%'>",
    "  <text x='50%' y='50%' font-size='24' fill='grey' text-anchor='middle' alignment-baseline='middle'>" + text + "</text>",
    "</svg>",
    '")'].join('');

  el.style.backgroundImage = str;
}

function showScript(source, target) {
  document.querySelector(source).innerHTML = document.querySelector(target).innerHTML;
}

function createSimulatedTouch(el) {
  let bar, x, y, cursorEl, top, left;
  el = typeof el === 'string' ? document.querySelector(el) : el;

  bcr = el.getBoundingClientRect();
  [x, y] = [bcr.left + (bcr.width/2), bcr.top+ (bcr.height/2)]; //center of an element
  [top, left] = [window.scrollY + y - 10, window.scrollX + x - 10];
  cursorEl = document.createElement('div');
  cursorEl.id = 'simulated-touch';
  cursorEl.style = `background: grey; border-radius:50%; width: 20px; height:20px;` + 
    `position:absolute; top: ${top}px; left: ${left}px; z-index: 100; opacity:0.5`;
  document.body.appendChild(cursorEl);

  return {clientX: x, clientY: y}
}

function removeSimulatedTouch() {
  document.querySelector('#simulated-touch').remove();
  return null;
}