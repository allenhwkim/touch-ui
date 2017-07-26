/**
 * Drop functionality that extends functionality of TouchUI
 *
 * Fires the following event to the given elements
 *   - drag-enter
 *   - drag-leave
 *   - drop
 *
 * How it works
 *   1. When touch moves on document with dragging,
 *      check if dragging element is overlaying drappable element
 *      If so, fire `drag-enter` event. If not, fire `drag-leave` event accordingly
 *   2. When touch ends on document with dragging
 *      if dragging element is overlaying a droppable element, fires `drop` event
 */
import TouchUI from './touch-ui';

class TouchDrop {
  constructor() {
    let args;

    args = TouchUI.parseArguments(Array.from(arguments));

    this.dropzoneEls = [];
    this.options = {};
    [this.dropzoneEls, this.options]  = [args.elements, args.options];

    this.touch = new TouchUI(); // sets basic touch events by watching start, move, and end
    this.savedDropzone = null;
    this.init();
  }

  init() {
    document.body.addEventListener(TouchUI.touchMove,  this.touchMoveHandler.bind(this));
    document.body.addEventListener(TouchUI.touchLeave, this.touchLeaveHandler.bind(this));
    document.body.addEventListener(TouchUI.touchEnd,   this.touchEndHandler.bind(this));
  }

  touchMoveHandler(e) {
    let dropzone;

    if (this.touch.dragEl) { // current under dragging
      dropzone = TouchUI.getOverlappingEl(this.touch.dragEl, this.dropzoneEls);
      if (dropzone && !this.savedDropzone) { // drag-enter
        this.savedDropzone = dropzone;
        TouchUI.fireTouchEvent(this.savedDropzone, 'drag-enter', e, {dragEl: this.touch.dragEl});
      } else if (this.savedDropzone && dropzone !== this.savedDropzone) { // drag-leave
        TouchUI.fireTouchEvent(this.savedDropzone, 'drag-leave', e, {dragEl: this.touch.dragEl});
        this.savedDropzone = null;
      }
    }
  }

  touchEndHandler(e) { // current under dragging
    if (this.touch.dragEl) {
      if (this.savedDropzone) {
        TouchUI.fireTouchEvent(this.savedDropzone, 'drop', e, {dragEl: this.touch.dragEl});
      }
    }
    this.dropzone && (this.dropzone = null);
  }

  touchLeaveHandler(e) {
    this.dropzone && (this.dropzone = null);
  }

}
/* alias of `new TouchDrag(..)` */
TouchUI.droppable = function () {
  return new TouchDrop(...arguments);
};

export default TouchDrop;
