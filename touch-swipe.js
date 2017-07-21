/**
 * Swipe functionality that extends functionality of TouchUI
 *
 * Fires the following event to the given elements
 *   - swipe-up
 *   - swipe-down
 *   - swipe-left
 *   - swipe-right
 * 
 * How it works
 *   1. When touch moves on the given element WITHOUT any dragging,
 *      fires swipe events
 */
class TouchSwipe {

  constructor() {
    this.els = [];
    let defaultOptions = {minMove: 100};
    let args = TouchUI.parseArguments(Array.from(arguments), defaultOptions);
    [this.els, this.options]  = [args.elements, args.options];
 
    this.touch = new TouchUI(); //sets basic touch events by watching start, move, and end
    this.init();
  }

  init() {
    this.els.forEach(el => {
      TouchUI.disableDefaultTouchBehaviour(el);
      el.addEventListener(TouchUI.touchMove,  this.touchMoveHandler.bind(this));
    })
  }

  touchMoveHandler(e) {
    if (!this.touch.dragEl) { //current under dragging
      let move = this.touch.getMove();
      if (move.length > this.options.minMove) {
        let eventName = 'swipe-' + move.direction;
        TouchUI.fireTouchEvent(e.target, eventName, e);
      }
    }
  }

}