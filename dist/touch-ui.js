(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("touch-ui", [], factory);
	else if(typeof exports === 'object')
		exports["touch-ui"] = factory();
	else
		root["touch-ui"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TouchPan = exports.TouchSwipe = exports.TouchDrop = exports.TouchDrag = exports.TouchUI = undefined;

var _touchUi = __webpack_require__(1);

var _touchUi2 = _interopRequireDefault(_touchUi);

var _touchDrag = __webpack_require__(2);

var _touchDrag2 = _interopRequireDefault(_touchDrag);

var _touchDrop = __webpack_require__(3);

var _touchDrop2 = _interopRequireDefault(_touchDrop);

var _touchSwipe = __webpack_require__(4);

var _touchSwipe2 = _interopRequireDefault(_touchSwipe);

var _touchPan = __webpack_require__(5);

var _touchPan2 = _interopRequireDefault(_touchPan);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.TouchUI = _touchUi2.default;
exports.TouchDrag = _touchDrag2.default;
exports.TouchDrop = _touchDrop2.default;
exports.TouchSwipe = _touchSwipe2.default;
exports.TouchPan = _touchPan2.default;

// for browser environment with `<script>` tag

window && (window.TouchUI = _touchUi2.default);

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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
var touchUIInstance = void 0;

var TouchUI = function () {
  function TouchUI() {
    _classCallCheck(this, TouchUI);

    if (!touchUIInstance) {
      touchUIInstance = this;
      this.startPosEvent = null; // position touch started
      this.startAt = null; // time touch  started

      this.prevPosEvent = null; // previous touch position when touch move
      this.endPosEvent = null; // the current touch position

      this.lastTouchEventName = null; // name of last event. e.g. tap, double-tap
      this.lastTouchEventAt = null; // time of last event

      this.lastMove = null; // movement between the previous and current position
      this.holdHappened = false; // true or false, indicates that hold happened or not

      this.tapTimer = null; // tap expires after this time
      this.holdTimer = null; // hold happens after his time

      this.dragEl = null; // the element that currently dragging
      this.init();
    }
    return touchUIInstance;
  }

  // add global event listener


  _createClass(TouchUI, [{
    key: 'init',
    value: function init() {
      this.tapTimer = null; // tap expires after this time
      this.holdTimer = null; // hold happens after his time

      // The following won't happen because it is a singleton
      var doc = document.body;

      doc.addEventListener(TouchUI.touchStart, this.touchStartHandler.bind(this), { passive: true });
      doc.addEventListener(TouchUI.touchMove, this.touchMoveHandler.bind(this), { passive: true });
      doc.addEventListener(TouchUI.touchEnd, this.touchEndHandler.bind(this), { passive: true });
      doc.addEventListener(TouchUI.touchLeave, this.touchResetHandler.bind(this), { passive: true });
    }
  }, {
    key: 'touchStartHandler',
    value: function touchStartHandler(e) {
      var _this = this;

      this.startPosEvent = e;
      this.startAt = new Date().getTime();
      this.holeHappened = false;

      clearTimeout(this.tapTimer);
      clearTimeout(this.holdTimer);
      this.holdTimer = setTimeout(function () {
        var eventName = _this.lastTouchEventName === 'tap' ? 'tap-and-hold' : _this.lastTouchEventName === 'double-tap' ? 'double-tap-and-hold' : 'hold';

        TouchUI.fireTouchEvent(e.target, eventName, e);
        _this.lastTouchEventName = eventName;
        _this.holdHappened = true;
        clearTimeout(_this.holdTimer);
      }, TouchUI.HOLD_TIME);
      this.prevPosEvent = this.startPosEvent;
    }
  }, {
    key: 'touchMoveHandler',
    value: function touchMoveHandler(e) {
      this.endPosEvent = e;
      this.lastMove = TouchUI.calcMove(this.prevPosEvent, this.endPosEvent);
      if (this.getMove().length > TouchUI.SMALL_MOVE) {
        // not a small movement
        clearTimeout(this.holdTimer);
        clearTimeout(this.tapTimer);
      }
      this.prevPosEvent = this.endPosEvent;
    }
  }, {
    key: 'touchEndHandler',
    value: function touchEndHandler(e) {
      this.endPosEvent = e;
      if (this.getMove().length < TouchUI.SMALL_MOVE) {
        // if little moved
        var eventName = this.lastTouchEventName === 'tap' ? 'double-tap' : this.lastTouchEventName === 'double-tap' ? 'triple-tap' : 'tap';

        TouchUI.fireTouchEvent(e.target, eventName, e);
        this.lastTouchEventName = eventName;
      }
      this.touchResetHandler();
    }
  }, {
    key: 'touchResetHandler',
    value: function touchResetHandler(e) {
      var _this2 = this;

      this.startPosEvent = null;
      this.startAt = null;
      this.prevPosEvent = null;
      this.endPosEvent = null;
      this.lastMove = null;
      this.holdHappened = false;
      clearTimeout(this.holdTimer);
      // this.lastTouchEventName = null;  // Don't do this. will be done by timer
      // this.lastTouchEventAt = null;    // Don't do this. will be done by timer
      // To catch continuous actoins, e.g., double-tap
      this.tapTimer = setTimeout(function () {
        _this2.lastTouchEventName = null;
        _this2.lastTouchEventAt = null;
      }, TouchUI.LAST_EVENT_RESET_TIME);
    }
  }, {
    key: 'getMove',
    value: function getMove() {
      return TouchUI.calcMove(this.startPosEvent, this.endPosEvent);
    }
  }]);

  return TouchUI;
}();

exports.default = TouchUI;


TouchUI.isTouch = function () {
  return 'ontouchstart' in window || navigator.MaxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
};

TouchUI.SMALL_MOVE = 10; // small movement; default 10px
TouchUI.HOLD_TIME = 100; // time in milliseconds that hold event fires, default 100ms
TouchUI.LAST_EVENT_RESET_TIME = 300; // time in milliseconds that the last event should be remembered. default 200ms

TouchUI.touchStart = TouchUI.isTouch() ? 'touchstart' : 'mousedown';
TouchUI.touchMove = TouchUI.isTouch() ? 'touchmove' : 'mousemove';
TouchUI.touchEnd = TouchUI.isTouch() ? 'touchend' : 'mouseup';
TouchUI.touchLeave = TouchUI.isTouch() ? 'touchleave' : 'mouseleave';
TouchUI.touchEnter = TouchUI.isTouch() ? 'touchenter' : 'mouseenter';

TouchUI.fireTouchEvent = function (el, eventName, orgEvent, eventData) {
  var customEvent = void 0;

  if (orgEvent.button) {
    // e.button  left 0, middle 1, right 2
    return false;
  }

  customEvent = new CustomEvent(eventName, orgEvent);

  for (var key in eventData || {}) {
    customEvent[key] = eventData[key];
  }

  customEvent.eventName = eventName;
  if (orgEvent.clientX) {
    customEvent.button = orgEvent.button;
    customEvent.which = orgEvent.which;
    customEvent.clientX = orgEvent.clientX;
    customEvent.clientY = orgEvent.clientY;
    customEvent.pageX = orgEvent.pageX;
    customEvent.pageY = orgEvent.pageY;
    customEvent.screenX = orgEvent.screenX;
    customEvent.screenY = orgEvent.screenY;
  }
  orgEvent.touches && (customEvent.touches = orgEvent.touches);
  orgEvent.changedTouches && (customEvent.changedTouches = orgEvent.changedTouches);
  orgEvent.targetTouches && (customEvent.targetTouches = orgEvent.targetTouches);

  el.dispatchEvent(customEvent);

  // orgEvent.preventDefault();
  return customEvent;
};

TouchUI.getStyle = function (elem, prop) {
  var style = void 0;

  if (elem.currentStyle) {
    style = elem.currentStyle[prop];
  } else if (window.getComputedStyle) {
    style = window.getComputedStyle(elem, null)[prop];
  }
  return style;
};

TouchUI.getOverlappingEl = function (inEl, outEls) {
  var rect1 = inEl.getBoundingClientRect(),
      rect2 = void 0,
      overlap = void 0;
  var ret = void 0;

  for (var i = 0; i < outEls.length; i++) {
    rect2 = outEls[i].getBoundingClientRect();
    overlap = !(rect1.right < rect2.left || rect1.left > rect2.right || rect1.bottom < rect2.top || rect1.top > rect2.bottom);
    if (overlap) {
      ret = outEls[i];
      break;
    }
  }
  return ret;
};

TouchUI.disableDefaultTouchBehaviour = function (el) {
  el.style.webkitTouchCallout = 'none';
  el.style.webkitUserSelect = 'none';
  el.style.mozUserSelect = 'none';
  el.style.webkitTapHighlightColor = 'rgba(0,0,0,0)';
  return el;
};

TouchUI.calcMove = function (startPosEvent, endPosEvent) {
  var move = { x: 0, y: 0, length: 0, direction: null };
  var staPos = void 0,
      endPos = void 0,
      startX = void 0,
      startY = void 0,
      endX = void 0,
      endY = void 0,
      moveX = void 0,
      moveY = void 0;

  if (startPosEvent && endPosEvent) {
    staPos = startPosEvent.touches && startPosEvent.touches[0] ? startPosEvent.touches[0] : startPosEvent.changedTouches && startPosEvent.changedTouches[0] ? startPosEvent.changedTouches[0] : startPosEvent;
    endPos = endPosEvent.touches && endPosEvent.touches[0] ? endPosEvent.touches[0] : endPosEvent.changedTouches && endPosEvent.changedTouches[0] ? endPosEvent.changedTouches[0] : endPosEvent;

    var _ref = [staPos.clientX, staPos.clientY];
    startX = _ref[0];
    startY = _ref[1];
    var _ref2 = [endPos.clientX, endPos.clientY];
    endX = _ref2[0];
    endY = _ref2[1];
    var _ref3 = [endX - startX, endY - startY];
    move.x = _ref3[0];
    move.y = _ref3[1];
    var _ref4 = [Math.abs(move.x), Math.abs(move.y)];
    moveX = _ref4[0];
    moveY = _ref4[1];

    move.direction = moveX > moveY && startX > endX ? 'left' : moveX > moveY && startX <= endX ? 'right' : moveX <= moveY && startY > endY ? 'up' : moveX <= moveY && startY <= endY ? 'down' : null;
    move.length = Math.floor(Math.sqrt(Math.pow(move.x, 2) + Math.pow(move.y, 2)));
  }
  return move;
};

TouchUI.parseArguments = function (args) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  // args is an array, Array.from(arguments), not arguments
  var parsed = { elements: [], options: options };

  args.forEach(function (arg) {
    if (Array.isArray(arg)) {
      parsed.elements = parsed.elements.concat(arg);
    } else if (arg instanceof HTMLElement) {
      parsed.elements.push(arg);
    } else if ((typeof arg === 'undefined' ? 'undefined' : _typeof(arg)) === 'object') {
      for (var key in arg) {
        parsed.options[key] = arg[key];
      }
    }
  });
  return parsed;
};

TouchUI.getOverlappingEl = function (el, candidates) {
  var rect1 = el.getBoundingClientRect(),
      rect2 = void 0,
      overlap = void 0;
  var ret = void 0;

  for (var i = 0; i < candidates.length; i++) {
    rect2 = candidates[i].getBoundingClientRect();
    overlap = !(rect1.right < rect2.left || rect1.left > rect2.right || rect1.bottom < rect2.top || rect1.top > rect2.bottom);
    if (overlap) {
      ret = candidates[i];
      break;
    }
  }
  return ret;
};
module.exports = exports['default'];

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
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


var _touchUi = __webpack_require__(1);

var _touchUi2 = _interopRequireDefault(_touchUi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TouchDrag = function () {
  function TouchDrag() {
    _classCallCheck(this, TouchDrag);

    this.els = [];
    var defaultOptions = { axis: 'xy' };
    var args = _touchUi2.default.parseArguments(Array.from(arguments), defaultOptions);

    var _ref = [args.elements, args.options];
    this.els = _ref[0];
    this.options = _ref[1];


    this.options.minHoldTime && (_touchUi2.default.HOLD_TIME = this.options.minHoldTime);

    this.touch; // singleton instance of TouchUI
    this.dragMoveFunc; //
    this.dragEndFunc; //
    this.dragStartAt; // time of hold + move happened
    this.dragStartStyle; // original style of dragging element

    this.init();
  }

  _createClass(TouchDrag, [{
    key: 'init',
    value: function init() {
      var _this = this;

      this.touch = new _touchUi2.default(); // sets basic touch events by watching start, move, and end
      this.dragMoveFunc = this.dragMoveHandler.bind(this);
      this.dragEndFunc = this.dragEndHandler.bind(this);

      this.els.forEach(function (el) {
        _touchUi2.default.disableDefaultTouchBehaviour(el);
        el.addEventListener('hold', function (e) {
          return _this.addDragListeners(document.body);
        });
      });

      this.dragStartAt = null;
    }

    // when touch starts add drag-related listeners

  }, {
    key: 'addDragListeners',
    value: function addDragListeners(el) {
      el.addEventListener(_touchUi2.default.touchMove, this.dragMoveFunc);
      el.addEventListener(_touchUi2.default.touchEnd, this.dragEndFunc);
      el.addEventListener(_touchUi2.default.touchLeave, this.dragEndFunc);
    }
  }, {
    key: 'removeEventListeners',
    value: function removeEventListeners(el) {
      el.removeEventListener(_touchUi2.default.touchMove, this.dragMoveFunc);
      el.removeEventListener(_touchUi2.default.touchEnd, this.dragEndFunc);
      el.removeEventListener(_touchUi2.default.touchLeave, this.dragEndFunc);
    }
  }, {
    key: 'dragMoveHandler',
    value: function dragMoveHandler(e) {
      var prevStyle = void 0,
          move = void 0,
          dragX = void 0,
          dragY = void 0;

      if (this.dragStartAt) {
        // if drag started
        _touchUi2.default.fireTouchEvent(this.touch.dragEl, 'drag-move', e);
      } else {
        this.dragStartAt = new Date().getTime();
        this.touch.dragEl = e.target;
        _touchUi2.default.fireTouchEvent(e.target, 'drag-start', e);
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
      dragX = this.options.axis.indexOf('x') !== -1 ? move.x : 0;
      dragY = this.options.axis.indexOf('y') !== -1 ? move.y : 0;
      this.touch.dragEl.style.left = this.dragStartStyle.bcr.left + window.scrollX + dragX + 'px';
      this.touch.dragEl.style.top = this.dragStartStyle.bcr.top + window.scrollY + dragY + 'px';
    }
  }, {
    key: 'dragEndHandler',
    value: function dragEndHandler(e) {
      // recover the original position
      if (this.touch.dragEl) {
        this.touch.dragEl.style.position = this.dragStartStyle.position;
        this.touch.dragEl.style.left = this.dragStartStyle.left;
        this.touch.dragEl.style.top = this.dragStartStyle.top;
        this.touch.dragEl.style.margin = this.dragStartStyle.margin;
        _touchUi2.default.fireTouchEvent(this.touch.dragEl, 'drag-end', e);
      }

      this.removeEventListeners(document.body);

      // reset drag-related variables
      this.dragStartAt = 0;
      this.touch.dragEl = null;
    }
  }]);

  return TouchDrag;
}();

/* alias of `new TouchDrag(..)` */


_touchUi2.default.draggable = function () {
  return new (Function.prototype.bind.apply(TouchDrag, [null].concat(Array.prototype.slice.call(arguments))))();
};

exports.default = TouchDrag;
module.exports = exports['default'];

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
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


var _touchUi = __webpack_require__(1);

var _touchUi2 = _interopRequireDefault(_touchUi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TouchDrop = function () {
  function TouchDrop() {
    _classCallCheck(this, TouchDrop);

    var args = void 0;

    args = _touchUi2.default.parseArguments(Array.from(arguments));

    this.dropzoneEls = [];
    this.options = {};
    var _ref = [args.elements, args.options];
    this.dropzoneEls = _ref[0];
    this.options = _ref[1];


    this.touch = new _touchUi2.default(); // sets basic touch events by watching start, move, and end
    this.savedDropzone = null;
    this.init();
  }

  _createClass(TouchDrop, [{
    key: 'init',
    value: function init() {
      document.body.addEventListener(_touchUi2.default.touchMove, this.touchMoveHandler.bind(this));
      document.body.addEventListener(_touchUi2.default.touchLeave, this.touchLeaveHandler.bind(this));
      document.body.addEventListener(_touchUi2.default.touchEnd, this.touchEndHandler.bind(this));
    }
  }, {
    key: 'touchMoveHandler',
    value: function touchMoveHandler(e) {
      var dropzone = void 0;

      if (this.touch.dragEl) {
        // current under dragging
        dropzone = _touchUi2.default.getOverlappingEl(this.touch.dragEl, this.dropzoneEls);
        if (dropzone && !this.savedDropzone) {
          // drag-enter
          this.savedDropzone = dropzone;
          _touchUi2.default.fireTouchEvent(this.savedDropzone, 'drag-enter', e, { dragEl: this.touch.dragEl });
        } else if (this.savedDropzone && dropzone !== this.savedDropzone) {
          // drag-leave
          _touchUi2.default.fireTouchEvent(this.savedDropzone, 'drag-leave', e, { dragEl: this.touch.dragEl });
          this.savedDropzone = null;
        }
      }
    }
  }, {
    key: 'touchEndHandler',
    value: function touchEndHandler(e) {
      // current under dragging
      if (this.touch.dragEl) {
        if (this.savedDropzone) {
          _touchUi2.default.fireTouchEvent(this.savedDropzone, 'drop', e, { dragEl: this.touch.dragEl });
        }
      }
      this.dropzone && (this.dropzone = null);
    }
  }, {
    key: 'touchLeaveHandler',
    value: function touchLeaveHandler(e) {
      this.dropzone && (this.dropzone = null);
    }
  }]);

  return TouchDrop;
}();
/* alias of `new TouchDrag(..)` */


_touchUi2.default.droppable = function () {
  return new (Function.prototype.bind.apply(TouchDrop, [null].concat(Array.prototype.slice.call(arguments))))();
};

exports.default = TouchDrop;
module.exports = exports['default'];

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
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


var _touchUi = __webpack_require__(1);

var _touchUi2 = _interopRequireDefault(_touchUi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TouchSwipe = function () {
  function TouchSwipe() {
    _classCallCheck(this, TouchSwipe);

    var defaultOptions = void 0,
        args = void 0;

    defaultOptions = { minMove: 50 };
    args = _touchUi2.default.parseArguments(Array.from(arguments), defaultOptions);
    var _ref = [args.elements, args.options];
    this.els = _ref[0];
    this.options = _ref[1];


    this.touch = new _touchUi2.default(); // sets basic touch events by watching start, move, and end
    this.init();
  }

  _createClass(TouchSwipe, [{
    key: 'init',
    value: function init() {
      var _this = this;

      this.els.forEach(function (el) {
        _touchUi2.default.disableDefaultTouchBehaviour(el);
        el.addEventListener(_touchUi2.default.touchMove, _this.touchMoveHandler.bind(_this), { passive: true });
      });
    }
  }, {
    key: 'touchMoveHandler',
    value: function touchMoveHandler(e) {
      var move = void 0,
          eventName = void 0;

      if (!this.touch.dragEl) {
        // current under dragging
        move = this.touch.getMove();
        if (move.length > this.options.minMove) {
          eventName = 'swipe-' + move.direction;
          _touchUi2.default.fireTouchEvent(e.target, eventName, e);
        }
      }
    }
  }]);

  return TouchSwipe;
}();

// alias of `new TouchSwipe(...)`


_touchUi2.default.swipable = function () {
  return new (Function.prototype.bind.apply(TouchSwipe, [null].concat(Array.prototype.slice.call(arguments))))();
};

exports.default = TouchSwipe;
module.exports = exports['default'];

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
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


var _touchUi = __webpack_require__(1);

var _touchUi2 = _interopRequireDefault(_touchUi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TouchPan = function () {
  function TouchPan() {
    _classCallCheck(this, TouchPan);

    this.els = [];
    var args = _touchUi2.default.parseArguments([].concat(Array.prototype.slice.call(arguments)));

    var _ref = [args.elements, args.options];
    this.els = _ref[0];
    this.options = _ref[1];


    this.touch; // singleton instance of TouchUI
    this.panStartAt; // time of hold + move happened

    this.handlers = {
      start: this.addPanListeners.bind(this),
      move: this.panMoveHandler.bind(this),
      end: this.panEndHandler.bind(this)
    };

    this.init();
  }

  _createClass(TouchPan, [{
    key: 'init',
    value: function init() {
      var _this = this;

      this.touch = new _touchUi2.default(); // sets basic touch events by watching start, move, and end
      this.panMoveFunc = this.handlers.move;
      this.panEndFunc = this.handlers.end;

      this.els.forEach(function (el) {
        _touchUi2.default.disableDefaultTouchBehaviour(el);
        el.addEventListener(_touchUi2.default.touchStart, _this.handlers.start);
      });

      this.panStartAt = null;
    }

    // when touch starts add pan-related listeners

  }, {
    key: 'addPanListeners',
    value: function addPanListeners(e) {
      e.target.addEventListener(_touchUi2.default.touchMove, this.handlers.move);
      e.target.addEventListener(_touchUi2.default.touchEnd, this.handlers.end);
      e.target.addEventListener(_touchUi2.default.touchLeave, this.handlers.end);
    }
  }, {
    key: 'removePanListeners',
    value: function removePanListeners(el) {
      el.removeEventListener(_touchUi2.default.touchMove, this.handlers.move);
      el.removeEventListener(_touchUi2.default.touchEnd, this.handlers.end);
      el.removeEventListener(_touchUi2.default.touchLeave, this.handlers.end);
    }
  }, {
    key: 'panMoveHandler',
    value: function panMoveHandler(e) {
      var eventData = { move: this.touch.getMove(), lastMove: this.touch.lastMove };

      if (this.panStartAt) {
        // if pan started
        _touchUi2.default.fireTouchEvent(e.target, 'pan-move', e, eventData);
      } else {
        _touchUi2.default.fireTouchEvent(e.target, 'pan-start', e, eventData);
        this.panStartAt = new Date().getTime();
      }
    }
  }, {
    key: 'panEndHandler',
    value: function panEndHandler(e) {
      this.panStartAt && _touchUi2.default.fireTouchEvent(e.target, 'pan-end', e);
      this.removePanListeners(e.target);

      // reset pan-related variables
      this.panStartAt = null;
    }
  }]);

  return TouchPan;
}();

/* alias of `new TouchPan(..)` */


_touchUi2.default.pannable = function () {
  return new (Function.prototype.bind.apply(TouchPan, [null].concat(Array.prototype.slice.call(arguments))))();
};

exports.default = TouchPan;
module.exports = exports['default'];

/***/ })
/******/ ]);
});
//# sourceMappingURL=touch-ui.js.map