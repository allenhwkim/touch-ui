/**
 * Design of resizable
 *
 *  . It uses TouchDrag
 *  . Configuration accepts sides to resize. e.g. bottom, right
 *  . When it is initialized, it adds a draggable element on the top of indicated side
 *    to resize the width or height of the element;
 *  . Bottom has the cursor of `ns-resize`, and right has the cursor of `ew-resize`
 *  . When resize starts, it saves the start position and fires `resize-start`
 *  . When resize, it fires `resize-move`
 *  . When resize ends, it fires `resize-end.
 */

import TouchUI from './touch-ui';
import TouchDrag from './touch-drag';

class TouchResize {

  constructor(options) {
    this.els = [];
    this.touch = new TouchUI();
    this.startWidth;
    this.startHeight;
    this.draggingEls = [];
    this.handlers = {
      end: this.resizeEndHandler.bind(this)
    };

    let defaultOptions = {positions: 'right, bottom'};
    let args = TouchUI.parseArguments([...arguments], defaultOptions);

    [this.els, this.options] = [args.elements, args.options];

    if (document.readyState === 'complete') {
      this.init();
    } else { // window.onload does not fire after window.onload is already fired.
      window.addEventListener('load', this.init.bind(this)); // positioning div should happen after all DOM is loaded
    }
  }

  init() {
    this.els.forEach(resizingEl => {
      this.draggingEls = this.createResizeOverlays(this.options);
      this.styleOverlayEls(resizingEl, this.draggingEls);
      this.draggingEls.forEach(draggingEl => {
        resizingEl.parentNode.insertBefore(draggingEl, resizingEl.nextSibling);
        this.applyDraggable({draggingEl: draggingEl, resizingEl: resizingEl});
      });
    });

    this.dragStartAt = null;
  }

  reset(options) {
    this.options = Object.assign(this.options, options);
    this.draggingEls.forEach(el => el.remove());
    this.draggingEls = [];
    document.removeEventListener(TouchUI.touchEnd, this.handlers.end);
    this.init();
  }

  resizeStartHandler(e, options) {
    let resizeElBCR = options.resizingEl.getBoundingClientRect(); // top, left, width, height
    let resizePosition = e.target.getAttribute('resize-direction');

    this.touch.firstTouchMove = true;
    this.startWidth = resizeElBCR.width;
    this.startHeight = resizeElBCR.height;
    this.resizeStarted = true;

    TouchUI.fireTouchEvent(options.resizingEl, 'resize-start', e, {resizePosition: resizePosition});
  }

  resizeMoveHandler(e, options) {
    if (this.resizeStarted) {
      let resizePosition = options.draggingEl.getAttribute('resize-position');
      let move = this.touch.getMove();

      if (this.touch.firstTouchMove) {
        e.preventDefault();
        this.touch.firstTouchMove = false;
      }

      if (resizePosition === 'right') {
        options.resizingEl.style.width  = this.startWidth + move.x + 'px';
      }
      if (resizePosition === 'bottom') {
        options.resizingEl.style.height = this.startHeight + move.y + 'px';
      }

      TouchUI.fireTouchEvent(options.resizingEl, 'resize-move', e, {
        move: move,
        resizePosition: resizePosition
      });
    }
  }

  resizeEndHandler(e, options) {
    let move = this.touch.getMove();
    let resizePosition = e.target.getAttribute('resize-position');

    this.draggingEls.forEach(el => (el.style.boxShadow = ''));
    this.resizeStarted = false;

    if (options) {
      this.styleOverlayEls(options.resizingEl, this.draggingEls);
      TouchUI.fireTouchEvent(options.resizingEl, 'resize-end', e, {
        move: move,
        resizePosition: resizePosition
      });
    }
  }

  createResizeOverlays(options) {
    /* eslint no-unused-vars: 0 */
    let draggingEl;
    let top, left, width, height, cursor;
    let positions = options.positions.split(',').map(p => p.trim());

    positions.forEach(key => {
      draggingEl = document.createElement('div');
      draggingEl.setAttribute('resize-position', key);
      this.draggingEls.push(draggingEl);
    });

    return this.draggingEls;
  }

  styleOverlayEls(resizeEl, draggingEls) {
    let resizeElBCR = resizeEl.getBoundingClientRect(); // top, left, width, height
    let top, left, width, height, cursor;

    draggingEls.forEach(draggingEl => {
      let key = draggingEl.getAttribute('resize-position');

      // set style including position
      top    =
        key === 'bottom' ? window.scrollY + resizeElBCR.bottom - 12 :
        key === 'right' ?  window.scrollY + resizeElBCR.top + 1 : 0;
      left   =
        key === 'bottom' ? window.scrollX + resizeElBCR.left - 1 :
        key === 'right' ?  window.scrollX + resizeElBCR.right - 12 : 0;
      width  =
        key === 'bottom' ? resizeElBCR.width - 2 :
        key === 'right' ?  20 : 0;
      height =
        key === 'bottom' ? 20 :
        key === 'right' ?  resizeElBCR.height - 2 : 0;
      cursor =
        key === 'bottom' ? 'ns-resize' :
        key === 'right' ?  'ew-resize' : 0;

      draggingEl.style.position = 'absolute';
      draggingEl.style.top = top + 'px';
      draggingEl.style.left = left + 'px';
      draggingEl.style.width = width + 'px';
      draggingEl.style.height = height + 'px';
      draggingEl.style.cursor = cursor;
      draggingEl.style.backgroundColor = 'rgba(0,0,0,0.0)';
    });
  }

  applyDraggable(options) {
    let drags = [], touchDrag;
    let resizePosition, dragAxis;
    let resizingEl = options.resizingEl, draggingEl = options.draggingEl;

    // add event listeners
    resizePosition = draggingEl.getAttribute('resize-position');
    dragAxis =
      resizePosition === 'right' ? 'x' :
      resizePosition === 'bottom' ? 'y' : 'xy';
    touchDrag = new TouchDrag(draggingEl, {axis: dragAxis, recoverWhenEnd: false});

    draggingEl.addEventListener('hold', e => {
      e.target.style.boxShadow = '0px 0px 2px 2px rgba(255,255,0,1)';
    });

    document.addEventListener(TouchUI.touchEnd, this.handlers.end);

    draggingEl.addEventListener('drag-start', e => {
      this.resizeStartHandler(e, options);
    });
    // draggingEl.addEventListener('drag-move', e => {
    //   this.resizeMoveHandler(e, options);
    // });
    document.body.addEventListener(TouchUI.touchMove, e => {
      this.resizeMoveHandler(e, options);
    });
    draggingEl.addEventListener('drag-end', e => {
      this.resizeEndHandler(e, options);
    });

    return draggingEl;
  }
}

/* alias of `new TouchDrag(..)` */
TouchUI.resizable = function () {
  return new TouchResize(...arguments);
};

export default TouchResize;
