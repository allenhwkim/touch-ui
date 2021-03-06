/**
 * TouchUI Core object
 *  - Singleton object
 * Fires the following events
 *  - tap
 *  - double-tap
 *  - triple-tap
 *  - hold
 *  - tap-and-hold
 *  - double-tap-and-hold
 *  - triple-tap-and-hold
 */
let touchUIInstance;

class TouchUI {

  constructor() {
    if (!touchUIInstance) {
      touchUIInstance = this;
      this.startTouches = null;  // position touch started
      this.prevTouches = null;   // previous touch position when touch move
      this.endTouches = null;    // the current touch position

      this.startAt = null;   // time touch  started

      this.lastTouchEventName = null; // name of last event. e.g. tap, double-tap
      this.lastTouchEventAt = null;   // time of last event

      this.lastMove = null;           // movement between the previous and current position
      this.holdHappened = false;      // true or false, indicates that hold happened or not

      this.tapTimer = null;           // tap expires after this time
      this.holdTimer = null;          // hold happens after his time

      this.dragEl = null;             // the element that currently dragging
      this.init();

      this.firstTouchMove = false;
    }
    return touchUIInstance;
  }

  // add global event listener
  init() {
    this.tapTimer = null;  // tap expires after this time
    this.holdTimer = null; // hold happens after his time

    // The following won't happen because it is a singleton
    let doc = document.body;

    doc.addEventListener(TouchUI.touchStart, this.touchStartHandler.bind(this), {passive: true});
    doc.addEventListener(TouchUI.touchMove,  this.touchMoveHandler.bind(this), {passive: true});
    doc.addEventListener(TouchUI.touchEnd,   this.touchEndHandler.bind(this), {passive: true});
    doc.addEventListener(TouchUI.touchLeave, this.touchResetHandler.bind(this), {passive: true});
  }

  touchStartHandler(e) {
    this.startTouches = e.changedTouches || [e];
    this.startAt = (new Date()).getTime();
    this.holdHappened = false;

    clearTimeout(this.tapTimer);
    clearTimeout(this.holdTimer);
    this.holdTimer =  setTimeout(() => {
      let eventName =
        this.lastTouchEventName === 'tap' ? 'tap-and-hold' :
        this.lastTouchEventName === 'double-tap' ? 'double-tap-and-hold' : 'hold';

      TouchUI.fireTouchEvent(e.target, eventName, e);
      this.lastTouchEventName = eventName;
      this.holdHappened = true;
      clearTimeout(this.holdTimer);
    }, TouchUI.HOLD_TIME);
    this.prevTouches = this.startTouches;
  }

  touchMoveHandler(e) {
    this.endTouches = e.changedTouches || [e];
    this.lastMove = TouchUI.calcMove(this.prevTouches, this.endTouches, 0); // 0:index
    if (this.getMove().distance > TouchUI.SMALL_MOVE) { // not a small movement
      clearTimeout(this.holdTimer);
      clearTimeout(this.tapTimer);
    }
    this.prevTouches = this.endTouches;
  }

  touchEndHandler(e) {
    this.endTouches = e.changedTouches || [e];
    if (this.getMove().distance < TouchUI.SMALL_MOVE) { // if little moved
      let eventName =
        this.lastTouchEventName === 'tap' ? 'double-tap' :
        this.lastTouchEventName === 'double-tap' ? 'triple-tap' : 'tap';

      TouchUI.fireTouchEvent(e.target, eventName, e);
      this.lastTouchEventName = eventName;
    }
    this.touchResetHandler();
  }

  touchResetHandler(e) {
    this.startTouches = null;
    this.startAt = null;
    this.prevTouches = null;
    this.endTouches = null;
    this.lastMove = null;
    this.holdHappened = false;
    clearTimeout(this.holdTimer);
    // this.lastTouchEventName = null;  // Don't do this. will be done by timer
    // this.lastTouchEventAt = null;    // Don't do this. will be done by timer
    // To catch continuous actoins, e.g., double-tap
    this.tapTimer = setTimeout(() => {
      this.lastTouchEventName = null;
      this.lastTouchEventAt = null;
    }, TouchUI.LAST_EVENT_RESET_TIME);
  }

  getMove() {
    return TouchUI.calcMove(this.startTouches, this.endTouches, 0); // 0: index
  }

}

TouchUI.isTouch = function () {
  return  ('ontouchstart' in window) ||
   (navigator.MaxTouchPoints > 0) ||
   (navigator.msMaxTouchPoints > 0);
};

TouchUI.SMALL_MOVE = 10;    // small movement; default 10px
TouchUI.HOLD_TIME  = 100;   // time in milliseconds that hold event fires, default 100ms
TouchUI.LAST_EVENT_RESET_TIME = 300; // time in milliseconds that the last event should be remembered. default 200ms

TouchUI.touchStart = TouchUI.isTouch() ? 'touchstart' : 'mousedown';
TouchUI.touchMove  = TouchUI.isTouch() ? 'touchmove'  : 'mousemove';
TouchUI.touchEnd   = TouchUI.isTouch() ? 'touchend'   : 'mouseup';
TouchUI.touchLeave = TouchUI.isTouch() ? 'touchleave' : 'mouseleave';
TouchUI.touchEnter = TouchUI.isTouch() ? 'touchenter' : 'mouseenter';

TouchUI.fireTouchEvent = function (el, eventName, orgEvent, eventData) {
  let customEvent;

  if (orgEvent.button) { // e.button  left 0, middle 1, right 2
    return false;
  }

  customEvent = new CustomEvent(eventName, orgEvent);

  for (let key in (eventData || {})) {
    customEvent[key] = eventData[key];
  }

  customEvent.eventName = eventName;
  if (orgEvent.clientX || orgEvent.pageX) {
    [
      'button', 'which', 'clientX', 'clientY', 'pageX', 'pageY',
      'screenX', 'screenY', 'altKey', 'ctrlKey', 'metaKey', 'shiftKey'
    ].forEach(key => (customEvent[key] = orgEvent[key]));
  }
  orgEvent.touches && (customEvent.touches = orgEvent.touches);
  orgEvent.changedTouches && (customEvent.changedTouches = orgEvent.changedTouches);
  orgEvent.targetTouches && (customEvent.targetTouches = orgEvent.targetTouches);

  el.dispatchEvent(customEvent);

  // orgEvent.preventDefault();
  return customEvent;
};

TouchUI.getStyle = function (elem, prop) {
  let style = elem.currentStyle ? elem.currentStyle : window.getComputedStyle(elem, null);

  return prop ? style[prop] : style;
};

TouchUI.disableDefaultTouchBehaviour = function (el) {
  el.style.webkitTouchCallout = 'none';
  el.style.webkitUserSelect = 'none';
  el.style.mozUserSelect = 'none';
  el.style.webkitTapHighlightColor = 'rgba(0,0,0,0)';
  return el;
};

TouchUI.calcMove = function (startTouches, endTouches, index = 0) {
  let move = { x: 0, y: 0, distance: 0, direction: null };
  let staPos, endPos, startX, startY, endX, endY;

  if (startTouches && endTouches) {
    staPos = startTouches[index];
    endPos = endTouches[index];

    [startX, startY] = [staPos.clientX, staPos.clientY];
    [endX, endY]     = [endPos.clientX, endPos.clientY];
    [move.x, move.y] = [endX - startX, endY - startY];

    move.direction = TouchUI.getDirection(staPos, endPos);
    move.distance  = TouchUI.getDistance(staPos, endPos);
  }

  return move;
};

TouchUI.getDistance = function (staPos, endPos) {
  return Math.round(
    Math.sqrt(
      Math.pow(staPos.clientX - endPos.clientX, 2) +
      Math.pow(staPos.clientY - endPos.clientY, 2)
    )
  );
};

// left, right, up, down
TouchUI.getDirection = function (staPos, endPos) {
  let startX, startY, endX, endY, moveX, moveY, direction;

  [startX, startY] = [staPos.clientX, staPos.clientY];
  [endX, endY]     = [endPos.clientX, endPos.clientY];

  [moveX, moveY]   = [Math.abs(endX - startX), Math.abs(endY - startY)];
  direction =
    (moveX >  moveY) && (startX >  endX) ? 'left' :
    (moveX >  moveY) && (startX <= endX) ? 'right' :
    (moveX <= moveY) && (startY >  endY) ? 'up' :
    (moveX <= moveY) && (startY <= endY) ? 'down' : null;

  return direction;
};

TouchUI.parseArguments = function (args, options = {}) { // args is an array, Array.from(arguments), not arguments
  if (!Array.isArray(args)) throw new Error('Invalid arguments. Must be an array');

  let parsed = {elements: [], options: options};

  args.forEach(arg => {
    if (typeof arg === 'string') {
      parsed.elements = parsed.elements.concat([...document.querySelectorAll(arg)]);
    } else if (Array.isArray(arg)) {
      parsed.elements = parsed.elements.concat(arg);
    } else if (arg instanceof HTMLElement) {
      parsed.elements.push(arg);
    } else if (typeof arg === 'object') {
      for (let key in arg) {
        parsed.options[key] = arg[key];
      }
    }
  });
  return parsed;
};

TouchUI.getOverlappingEl = function (el, candidates) {
  let rect1 = el.getBoundingClientRect(), rect2, overlap;
  let ret;

  for (let i = 0; i < candidates.length; i++) {
    rect2 = candidates[i].getBoundingClientRect();
    overlap = !(
      rect1.right < rect2.left ||  rect1.left > rect2.right ||
      rect1.bottom < rect2.top ||  rect1.top > rect2.bottom
    );
    if (overlap) {
      ret = candidates[i];
      break;
    }
  }
  return ret;
};

TouchUI.touchDistanceFromElementCenter = function (el, touchEvent) {
  let elBCR = el.getBoundingClientRect();

  let center = {
    x: window.scrollX + elBCR.left + (elBCR.width / 2),
    y: window.scrollY + elBCR.top + (elBCR.height / 2)
  };

  let distance = {
    x: touchEvent.clientX  - center.x,
    y: touchEvent.clientY - center.y
  };

  return Math.sqrt(Math.pow(distance.x, 2) + Math.pow(distance.y, 2));
};

export default TouchUI;
