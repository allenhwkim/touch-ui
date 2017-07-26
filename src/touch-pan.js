/**
 * Extends functionality of TouchUI
 *
 * Fires the following event to the given elements
 *   - pan-start
 *   - pan-move
 *   - pan-end
 *
 * How it works
 *   1. when hold happens, adds panning listeners to the element
 *   2. with minimal touch moves on the element, it fires `pan-start`
 *      With pan started and touch moves, it fires `pan-move`
 *   3. when touch move ends and there is panning element, it fires `pan-end`
 */
import TouchUI from './touch-ui';

class TouchPan {

  constructor() {
    this.els = [];
    let args = TouchUI.parseArguments([...arguments]);

    [this.els, this.options] = [args.elements, args.options];

    this.touch;         // singleton instance of TouchUI
    this.panStartAt;    // time of hold + move happened

    this.handlers = {
      start: this.addPanListeners.bind(this),
      move: this.panMoveHandler.bind(this),
      end: this.panEndHandler.bind(this)
    };

    this.init();
  }

  init() {
    this.touch = new TouchUI(); // sets basic touch events by watching start, move, and end
    this.panMoveFunc = this.handlers.move;
    this.panEndFunc  = this.handlers.end;

    this.els.forEach(el => {
      TouchUI.disableDefaultTouchBehaviour(el);
      el.addEventListener(TouchUI.touchStart, this.handlers.start);
    });

    this.panStartAt = null;
  }

  // when touch starts add pan-related listeners
  addPanListeners(e) {
    e.target.addEventListener(TouchUI.touchMove,  this.handlers.move);
    e.target.addEventListener(TouchUI.touchEnd,   this.handlers.end);
    e.target.addEventListener(TouchUI.touchLeave, this.handlers.end);
  }

  removePanListeners(el) {
    el.removeEventListener(TouchUI.touchMove,  this.handlers.move);
    el.removeEventListener(TouchUI.touchEnd,   this.handlers.end);
    el.removeEventListener(TouchUI.touchLeave, this.handlers.end);
  }

  panMoveHandler(e) {
    let eventData = { move: this.touch.getMove(), lastMove: this.touch.lastMove };

    if (this.panStartAt) { // if pan started
      TouchUI.fireTouchEvent(e.target, 'pan-move', e, eventData);
    } else {
      TouchUI.fireTouchEvent(e.target, 'pan-start', e, eventData);
      this.panStartAt = (new Date()).getTime();
    }
  }

  panEndHandler(e) {
    this.panStartAt && TouchUI.fireTouchEvent(e.target, 'pan-end', e);
    this.removePanListeners(e.target);

    // reset pan-related variables
    this.panStartAt = null;
  }

}

/* alias of `new TouchPan(..)` */
TouchUI.pannable = function () {
  return new TouchPan(...arguments);
};

export default TouchPan;
