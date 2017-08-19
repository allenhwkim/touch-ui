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

function removeSimulatedTouch() {
  document.querySelector('#simulated-touch').remove();
  return null;
}