/**
 * Extends functionality of TouchUI
 *
 * Fires the following event to the given elements
 *   - zoom-start
 *   - zoom-move
 *   - zoom-end
 *
 * How it works
 *   1. when hold happens, adds zoom listeners to the element
 *   2. with minimal touch moves on the element, it fires `zoom-start`
 *      With zoom started and touch moves, it fiStephen Elliott <Stephen.Elliott@rci.rogers.com>res `zoom-move`
 *   3. when touch move ends and if zoom started, it fires `zoom-end`
 */
import TouchUI from './touch-ui';

class TouchZoom {

  constructor() {
    this.els = [];
    let args = TouchUI.parseArguments([...arguments]);

    [this.els, this.options] = [args.elements, args.options];

    this.touch;         // singleton instance of TouchUI
    this.zoomStartAt;    // time of hold + move happened

    this.handlers = {
      start: this.addZoomListeners.bind(this),
      move: this.zoomMoveHandler.bind(this),
      end: this.zoomEndHandler.bind(this)
    };

    this.init();
  }

  init() {
    this.touch = new TouchUI(); // sets basic touch events by watching start, move, and end

    this.els.forEach(el => {
      TouchUI.disableDefaultTouchBehaviour(el);
      el.addEventListener(TouchUI.touchStart, this.handlers.start, {passive: true});
    });

  }

  // when touch starts add zoom-related listeners
  addZoomListeners(e) {
    this.touch.firstTouchMove = true;

    e.target.addEventListener(TouchUI.touchMove,  this.handlers.move, {passive: true});
    e.target.addEventListener(TouchUI.touchEnd,   this.handlers.end);
    e.target.addEventListener(TouchUI.touchLeave, this.handlers.end);
  }

  removeZoomListeners(el) {
    el.removeEventListener(TouchUI.touchMove,  this.handlers.move);
    el.removeEventListener(TouchUI.touchEnd,   this.handlers.end);
    el.removeEventListener(TouchUI.touchLeave, this.handlers.end);
  }

  zoomMoveHandler(e) {
    let moves = this.touch.getMoves();

    if (this.touch.firstTouchMove) {
      this.touch.firstTouchMove = false;
      e.preventDefault();
    }

    if (!this.zoomStartAt && Math.abs(moves.diffTouchDistance) > 20) {
      TouchUI.fireTouchEvent(e.target, 'zoom-start', e, {moves: moves});
      this.zoomStartAt = (new Date()).getTime();
    } else if (this.zoomStartAt) {
      TouchUI.fireTouchEvent(e.target, 'zoom-move', e, {moves: moves});
    }
  }

  zoomEndHandler(e) {
    if (this.zoomStartAt) {
      TouchUI.fireTouchEvent(e.target, 'zoom-end', e);
    }
    this.zoomStartAt = null;
    this.removeZoomListeners(e.target);
  }

}

/* alias of `new TouchZoom(..)` */
TouchUI.zoomable = function () {
  return new TouchZoom(...arguments);
};

export default TouchZoom;
