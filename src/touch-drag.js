/**
 * Extends functionality of TouchUI
 *
 * Fires the following event to the given elements
 *   - drag-start
 *   - drag-move
 *   - drag-end
 *
 * How it works
 *   1. when hold happens, adds dragging listeners to document.
 *   2. with minimal touch moves of document, draggint starts.
 *      When drag starts
 *      - it saves the element drag started
 *      - it saves the style of the element
 *      - change the style of the element(absolute positioning with no margin)
 *      With drag started and touch moves
 *      - reposition the element, by changing left/top position
 *   3. when touch move ends and there is dragging element
 *      - resets the style of the element from saved style
 *      - remove dragging listeners from the document
 */
import TouchUI from './touch-ui';

class TouchDrag {

  constructor() {
    this.els = [];
    let defaultOptions = {axis: 'xy'};
    let args = TouchUI.parseArguments([...arguments], defaultOptions);

    [this.els, this.options] = [args.elements, args.options];

    this.options.minHoldTime && (TouchUI.HOLD_TIME = this.options.minHoldTime);

    this.touch;          // singleton instance of TouchUI
    this.dragMoveFunc;   //
    this.dragEndFunc;    //
    this.dragStartAt;    // time of hold + move happened
    this.dragStartStyle; // original style of dragging element

    this.init();
  }

  init() {
    this.touch = new TouchUI(); // sets basic touch events by watching start, move, and end
    this.dragMoveFunc = this.dragMoveHandler.bind(this);
    this.dragEndFunc  = this.dragEndHandler.bind(this);

    this.els.forEach(el => {
      TouchUI.disableDefaultTouchBehaviour(el);
      el.addEventListener('hold', e => this.addDragListeners(document.body));
    });

    this.dragStartAt = null;
  }

  // when touch starts add drag-related listeners
  addDragListeners(el) {
    el.addEventListener(TouchUI.touchMove,  this.dragMoveFunc);
    el.addEventListener(TouchUI.touchEnd,   this.dragEndFunc);
    el.addEventListener(TouchUI.touchLeave, this.dragEndFunc);
  }

  removeEventListeners(el) {
    el.removeEventListener(TouchUI.touchMove,  this.dragMoveFunc);
    el.removeEventListener(TouchUI.touchEnd,   this.dragEndFunc);
    el.removeEventListener(TouchUI.touchLeave, this.dragEndFunc);
  }

  dragMoveHandler(e) {
    let prevStyle, move, dragX, dragY;

    if (this.dragStartAt) { // if drag started
      TouchUI.fireTouchEvent(this.touch.dragEl, 'drag-move', e);
    } else {
      this.dragStartAt = (new Date()).getTime();
      this.touch.dragEl = e.target;
      TouchUI.fireTouchEvent(e.target, 'drag-start', e);
      prevStyle = window.getComputedStyle(e.target, null);

      this.dragStartStyle = {
        position: prevStyle.position,
        left: prevStyle.left,
        top: prevStyle.top,
        margin: prevStyle.margin,
        bcr: e.target.getBoundingClientRect()
      };
      e.target.style.position = 'absolute';
      e.target.style.margin = 0;
    }
    move = this.touch.getMove();
    dragX = (this.options.axis.indexOf('x') !== -1) ? move.x : 0;
    dragY = (this.options.axis.indexOf('y') !== -1) ? move.y : 0;
    this.touch.dragEl.style.left = (this.dragStartStyle.bcr.left + window.scrollX + dragX) + 'px';
    this.touch.dragEl.style.top  = (this.dragStartStyle.bcr.top  + window.scrollY + dragY) + 'px';
  }

  dragEndHandler(e) {
    // recover the original position
    if (this.touch.dragEl) {
      this.touch.dragEl.style.position = this.dragStartStyle.position;
      this.touch.dragEl.style.left = this.dragStartStyle.left;
      this.touch.dragEl.style.top = this.dragStartStyle.top;
      this.touch.dragEl.style.margin = this.dragStartStyle.margin;
      TouchUI.fireTouchEvent(this.touch.dragEl, 'drag-end', e);
    }

    this.removeEventListeners(document.body);

    // reset drag-related variables
    this.dragStartAt = 0;
    this.touch.dragEl = null;
  }

}

/* alias of `new TouchDrag(..)` */
TouchUI.draggable = function () {
  return new TouchDrag(...arguments);
};

export default TouchDrag;
