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
    this.overlayEls = [];
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
    this.els.forEach(resizeEl => {
      this.overlayEls = this.createResizeOverlays(this.options);
      this.styleOverlayEls(resizeEl, this.overlayEls);
      this.overlayEls.forEach(overlayEl => {
        resizeEl.parentNode.insertBefore(overlayEl, resizeEl.nextSibling);
        this.applyDraggable(overlayEl, resizeEl);
      });
    });

    this.dragStartAt = null;
  }

  reset(options) {
    this.options = Object.assign(this.options, options);
    this.overlayEls.forEach(el => el.remove());
    this.overlayEls = [];
    document.removeEventListener(TouchUI.touchEnd, this.handlers.end);
    this.init();
  }

  resizeStartHandler(e) {
    let resizeEl = e.resizeFor;
    let resizeElBCR = resizeEl.getBoundingClientRect(); // top, left, width, height
    let resizePosition = e.target.getAttribute('resize-direction');

    this.touch.firstTouchMove = true;
    this.startWidth = resizeElBCR.width;
    this.startHeight = resizeElBCR.height;

    TouchUI.fireTouchEvent(e.resizeFor, 'resize-start', e, {resizePosition: resizePosition});
  }

  resizeMoveHandler(e) {
    let resizeEl = e.resizeFor;
    let resizePosition = e.target.getAttribute('resize-position');
    let move = this.touch.getMove();

    if (this.touch.firstTouchMove) {
      e.preventDefault();
      this.touch.firstTouchMove = false;
    }

    if (resizePosition === 'right') {
      resizeEl.style.width  = this.startWidth + move.x + 'px';
    }
    if (resizePosition === 'bottom') {
      resizeEl.style.height = this.startHeight + move.y + 'px';
    }

    TouchUI.fireTouchEvent(e.resizeFor, 'resize-move', e, {
      move: move,
      resizePosition: resizePosition
    });
  }

  resizeEndHandler(e) {
    let move = this.touch.getMove();
    let resizePosition = e.target.getAttribute('resize-position');

    this.overlayEls.forEach(overlayEl => {
      overlayEl.style.boxShadow = '';
    });

    if (e.resizeFor) {
      this.styleOverlayEls(e.resizeFor, this.overlayEls);
      TouchUI.fireTouchEvent(e.resizeFor, 'resize-end', e, {
        move: move,
        resizePosition: resizePosition
      });
    }
  }

  createResizeOverlays(options) {
    /* eslint no-unused-vars: 0 */
    let overlayEl;
    let top, left, width, height, cursor;
    let positions = options.positions.split(',').map(p => p.trim());

    positions.forEach(key => {
      overlayEl = document.createElement('div');
      overlayEl.setAttribute('resize-position', key);
      this.overlayEls.push(overlayEl);
    });

    return this.overlayEls;
  }

  styleOverlayEls(resizeEl, overlayEls) {
    let resizeElBCR = resizeEl.getBoundingClientRect(); // top, left, width, height
    let top, left, width, height, cursor;

    overlayEls.forEach(overlayEl => {
      let key = overlayEl.getAttribute('resize-position');

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

      overlayEl.style.position = 'absolute';
      overlayEl.style.top = top + 'px';
      overlayEl.style.left = left + 'px';
      overlayEl.style.width = width + 'px';
      overlayEl.style.height = height + 'px';
      overlayEl.style.cursor = cursor;
      overlayEl.style.backgroundColor = 'rgba(0,0,0,0.0)';
    });
  }

  applyDraggable(overlayEl, resizeForEl) {
    let drags = [], touchDrag;
    let resizePosition, dragAxis;

    // add event listeners
    resizePosition = overlayEl.getAttribute('resize-position');
    dragAxis =
      resizePosition === 'right' ? 'x' :
      resizePosition === 'bottom' ? 'y' : 'xy';
    touchDrag = new TouchDrag(overlayEl, {axis: dragAxis, recoverWhenEnd: false});

    overlayEl.addEventListener('hold', e => {
      e.target.style.boxShadow = '0px 0px 2px 2px rgba(255,255,0,1)';
    });

    document.addEventListener(TouchUI.touchEnd, this.handlers.end);

    overlayEl.addEventListener('drag-start', e => {
      e.resizeFor = resizeForEl;
      this.resizeStartHandler(e);
    });
    overlayEl.addEventListener('drag-move', e => {
      e.resizeFor = resizeForEl;
      this.resizeMoveHandler(e);
    });
    overlayEl.addEventListener('drag-end', e => {
      e.resizeFor = resizeForEl;
      this.resizeEndHandler(e);
    });

    return overlayEl;
  }
}

/* alias of `new TouchDrag(..)` */
TouchUI.resizable = function () {
  return new TouchResize(...arguments);
};

export default TouchResize;
