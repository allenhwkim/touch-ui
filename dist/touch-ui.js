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
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

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
      this.startTouches = null; // position touch started
      this.prevTouches = null; // previous touch position when touch move
      this.endTouches = null; // the current touch position

      this.startAt = null; // time touch  started

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

      doc.addEventListener(TouchUI.touchStart, this.touchStartHandler.bind(this), { passive: false });
      doc.addEventListener(TouchUI.touchMove, this.touchMoveHandler.bind(this), { passive: true });
      doc.addEventListener(TouchUI.touchEnd, this.touchEndHandler.bind(this), { passive: true });
      doc.addEventListener(TouchUI.touchLeave, this.touchResetHandler.bind(this), { passive: true });
    }
  }, {
    key: 'touchStartHandler',
    value: function touchStartHandler(e) {
      var _this = this;

      this.startTouches = e.changedTouches || [e];
      this.startAt = new Date().getTime();
      this.holdHappened = false;

      clearTimeout(this.tapTimer);
      clearTimeout(this.holdTimer);
      this.holdTimer = setTimeout(function () {
        var eventName = _this.lastTouchEventName === 'tap' ? 'tap-and-hold' : _this.lastTouchEventName === 'double-tap' ? 'double-tap-and-hold' : 'hold';

        TouchUI.fireTouchEvent(e.target, eventName, e);
        _this.lastTouchEventName = eventName;
        _this.holdHappened = true;
        clearTimeout(_this.holdTimer);
      }, TouchUI.HOLD_TIME);
      this.prevTouches = this.startTouches;
      e.preventDefault();
    }
  }, {
    key: 'touchMoveHandler',
    value: function touchMoveHandler(e) {
      this.endTouches = e.changedTouches || [e];
      this.lastMove = TouchUI.calcMove(this.prevTouches, this.endTouches, 0); // 0:index
      if (this.getMove().distance > TouchUI.SMALL_MOVE) {
        // not a small movement
        clearTimeout(this.holdTimer);
        clearTimeout(this.tapTimer);
      }
      this.prevTouches = this.endTouches;
      // e.preventDefault();
    }
  }, {
    key: 'touchEndHandler',
    value: function touchEndHandler(e) {
      this.endTouches = e.changedTouches || [e];
      if (this.getMove().distance < TouchUI.SMALL_MOVE) {
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
      this.tapTimer = setTimeout(function () {
        _this2.lastTouchEventName = null;
        _this2.lastTouchEventAt = null;
      }, TouchUI.LAST_EVENT_RESET_TIME);
    }
  }, {
    key: 'getMove',
    value: function getMove() {
      return TouchUI.calcMove(this.startTouches, this.endTouches, 0); // 0: index
    }

    /**
     * moves of two finger touches.
     * returns length and distance of two touches
     * e.g. {
     *   numTouches: 2,
     *   diffTouchDistance: 10,
     *   1: {x: 3, y: 4, distance: 5, direction: 'left'},
     *   2: {x: 2, y: 3, distance: 4, direction: 'right'}
     * }
     */

  }, {
    key: 'getMoves',
    value: function getMoves() {
      var staTouches = this.startTouches;
      var endTouches = this.endTouches;
      var moves = {};

      // simulate a fake touch point for non-mobile device if defined
      if (this.endTouches && this.startTouches) {
        if (!this.endTouches[1] && this.simulatedTouch) {
          this.endTouches[1] = this.simulatedTouch;
          this.startTouches[1] = this.simulatedTouch;
        }

        if (this.endTouches.length === 2) {
          moves.diffTouchDistance = // distance of movement between two touches
          TouchUI.getDistance(endTouches[0], endTouches[1]) - // when ends
          TouchUI.getDistance(staTouches[0], staTouches[1]); // when starts
          // moves.rotationDegree = TouchUI.getRotationDegree(staTouches, endTouches);
        }
      }
      return moves;
    }
  }]);

  return TouchUI;
}();

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

  orgEvent.preventDefault();
  return customEvent;
};

TouchUI.getStyle = function (elem, prop) {
  var style = elem.currentStyle ? elem.currentStyle : window.getComputedStyle(elem, null);

  return prop ? style[prop] : style;
};

TouchUI.disableDefaultTouchBehaviour = function (el) {
  el.style.webkitTouchCallout = 'none';
  el.style.webkitUserSelect = 'none';
  el.style.mozUserSelect = 'none';
  el.style.webkitTapHighlightColor = 'rgba(0,0,0,0)';
  return el;
};

TouchUI.calcMove = function (startTouches, endTouches) {
  var index = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

  var move = { x: 0, y: 0, distance: 0, direction: null };
  var staPos = void 0,
      endPos = void 0,
      startX = void 0,
      startY = void 0,
      endX = void 0,
      endY = void 0;

  if (startTouches && endTouches) {
    staPos = startTouches[index];
    endPos = endTouches[index];

    var _ref = [staPos.clientX, staPos.clientY];
    startX = _ref[0];
    startY = _ref[1];
    var _ref2 = [endPos.clientX, endPos.clientY];
    endX = _ref2[0];
    endY = _ref2[1];
    var _ref3 = [endX - startX, endY - startY];
    move.x = _ref3[0];
    move.y = _ref3[1];


    move.direction = TouchUI.getDirection(staPos, endPos);
    move.distance = TouchUI.getDistance(staPos, endPos);
  }

  return move;
};

TouchUI.getDistance = function (staPos, endPos) {
  return Math.round(Math.sqrt(Math.pow(staPos.clientX - endPos.clientX, 2) + Math.pow(staPos.clientY - endPos.clientY, 2)));
};

// left, right, up, down
TouchUI.getDirection = function (staPos, endPos) {
  var startX = void 0,
      startY = void 0,
      endX = void 0,
      endY = void 0,
      moveX = void 0,
      moveY = void 0,
      direction = void 0;

  var _ref4 = [staPos.clientX, staPos.clientY];
  startX = _ref4[0];
  startY = _ref4[1];
  var _ref5 = [endPos.clientX, endPos.clientY];
  endX = _ref5[0];
  endY = _ref5[1];
  var _ref6 = [Math.abs(endX - startX), Math.abs(endY - startY)];
  moveX = _ref6[0];
  moveY = _ref6[1];

  direction = moveX > moveY && startX > endX ? 'left' : moveX > moveY && startX <= endX ? 'right' : moveX <= moveY && startY > endY ? 'up' : moveX <= moveY && startY <= endY ? 'down' : null;

  return direction;
};

TouchUI.parseArguments = function (args) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  // args is an array, Array.from(arguments), not arguments
  if (!Array.isArray(args)) throw new Error('Invalid arguments. Must be an array');

  var parsed = { elements: [], options: options };

  args.forEach(function (arg) {
    if (typeof arg === 'string') {
      parsed.elements = parsed.elements.concat([].concat(_toConsumableArray(document.querySelectorAll(arg))));
    } else if (Array.isArray(arg)) {
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

/* Unused as of now
TouchUI.getRotationDegree = function (start, end) {
  let diffTouch1 = {
    x: (start[0].clientX - start[1].clientX),
    y: (start[0].clientY - start[1].clientY)
  };
  let diffTouch2 = {
    x: (end[0].clientX - end[1].clientX),
    y: (end[0].clientY - end[1].clientY)
  };

  var degree = Math.atan2(
      diffTouch2.y - diffTouch1.y,
      diffTouch2.x - diffTouch1.x
    ) * 180 / Math.PI;

  return degree;
};
*/

exports.default = TouchUI;
module.exports = exports['default'];

/***/ }),
/* 1 */
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


var _touchUi = __webpack_require__(0);

var _touchUi2 = _interopRequireDefault(_touchUi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TouchDrag = function () {
  function TouchDrag() {
    _classCallCheck(this, TouchDrag);

    this.els = [];
    var defaultOptions = { axis: 'xy' };
    var args = _touchUi2.default.parseArguments([].concat(Array.prototype.slice.call(arguments)), defaultOptions);

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
        el.setAttribute('touch-drag', 'true');
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
      el.setAttribute('touch-drag', 'start');
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
      el.setAttribute('touch-drag', 'end');
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
      } else if (e.target.getAttribute('touch-drag')) {
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
      if (this.touch.dragEl) {
        move = this.touch.getMove();
        dragX = this.options.axis.indexOf('x') !== -1 ? move.x : 0;
        dragY = this.options.axis.indexOf('y') !== -1 ? move.y : 0;
        this.touch.dragEl.style.left = this.dragStartStyle.bcr.left + window.scrollX + dragX + 'px';
        this.touch.dragEl.style.top = this.dragStartStyle.bcr.top + window.scrollY + dragY + 'px';
      }
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
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TouchResize = exports.TouchZoom = exports.TouchPan = exports.TouchSwipe = exports.TouchDrop = exports.TouchDrag = exports.TouchUI = undefined;

var _touchUi = __webpack_require__(0);

var _touchUi2 = _interopRequireDefault(_touchUi);

var _touchDrag = __webpack_require__(1);

var _touchDrag2 = _interopRequireDefault(_touchDrag);

var _touchDrop = __webpack_require__(3);

var _touchDrop2 = _interopRequireDefault(_touchDrop);

var _touchSwipe = __webpack_require__(4);

var _touchSwipe2 = _interopRequireDefault(_touchSwipe);

var _touchPan = __webpack_require__(5);

var _touchPan2 = _interopRequireDefault(_touchPan);

var _touchZoom = __webpack_require__(6);

var _touchZoom2 = _interopRequireDefault(_touchZoom);

var _touchResize = __webpack_require__(7);

var _touchResize2 = _interopRequireDefault(_touchResize);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.TouchUI = _touchUi2.default;
exports.TouchDrag = _touchDrag2.default;
exports.TouchDrop = _touchDrop2.default;
exports.TouchSwipe = _touchSwipe2.default;
exports.TouchPan = _touchPan2.default;
exports.TouchZoom = _touchZoom2.default;
exports.TouchResize = _touchResize2.default;

// for browser environment with `<script>` tag

window && (window.TouchUI = _touchUi2.default);

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


var _touchUi = __webpack_require__(0);

var _touchUi2 = _interopRequireDefault(_touchUi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TouchDrop = function () {
  function TouchDrop() {
    _classCallCheck(this, TouchDrop);

    var args = void 0;

    args = _touchUi2.default.parseArguments([].concat(Array.prototype.slice.call(arguments)));

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


var _touchUi = __webpack_require__(0);

var _touchUi2 = _interopRequireDefault(_touchUi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TouchSwipe = function () {
  function TouchSwipe() {
    _classCallCheck(this, TouchSwipe);

    var defaultOptions = void 0,
        args = void 0;

    defaultOptions = { minMove: 50 };
    args = _touchUi2.default.parseArguments([].concat(Array.prototype.slice.call(arguments)), defaultOptions);
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
        el.addEventListener(_touchUi2.default.touchEnd, _this.touchEndHandler.bind(_this), { passive: true });
      });
    }
  }, {
    key: 'touchEndHandler',
    value: function touchEndHandler(e) {
      var move = void 0,
          eventName = void 0;

      if (!this.touch.dragEl) {
        // current under dragging
        move = this.touch.getMove();
        if (move.distance > this.options.minMove) {
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


var _touchUi = __webpack_require__(0);

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
        el.addEventListener(_touchUi2.default.touchStart, _this.handlers.start, { passive: true });
      });

      this.panStartAt = null;
    }

    // when touch starts add pan-related listeners

  }, {
    key: 'addPanListeners',
    value: function addPanListeners(e) {
      e.target.addEventListener(_touchUi2.default.touchMove, this.handlers.move, { passive: true });
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

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
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


var _touchUi = __webpack_require__(0);

var _touchUi2 = _interopRequireDefault(_touchUi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TouchZoom = function () {
  function TouchZoom() {
    _classCallCheck(this, TouchZoom);

    this.els = [];
    var args = _touchUi2.default.parseArguments([].concat(Array.prototype.slice.call(arguments)));

    var _ref = [args.elements, args.options];
    this.els = _ref[0];
    this.options = _ref[1];


    this.touch; // singleton instance of TouchUI
    this.zoomStartAt; // time of hold + move happened

    this.handlers = {
      start: this.addZoomListeners.bind(this),
      move: this.zoomMoveHandler.bind(this),
      end: this.zoomEndHandler.bind(this)
    };

    this.init();
  }

  _createClass(TouchZoom, [{
    key: 'init',
    value: function init() {
      var _this = this;

      this.touch = new _touchUi2.default(); // sets basic touch events by watching start, move, and end

      this.els.forEach(function (el) {
        _touchUi2.default.disableDefaultTouchBehaviour(el);
        el.addEventListener(_touchUi2.default.touchStart, _this.handlers.start, { passive: true });
      });
    }

    // when touch starts add zoom-related listeners

  }, {
    key: 'addZoomListeners',
    value: function addZoomListeners(e) {
      console.log(1111111111111, e.target);
      e.target.addEventListener(_touchUi2.default.touchMove, this.handlers.move, { passive: true });
      e.target.addEventListener(_touchUi2.default.touchEnd, this.handlers.end);
      e.target.addEventListener(_touchUi2.default.touchLeave, this.handlers.end);
    }
  }, {
    key: 'removeZoomListeners',
    value: function removeZoomListeners(el) {
      el.removeEventListener(_touchUi2.default.touchMove, this.handlers.move);
      el.removeEventListener(_touchUi2.default.touchEnd, this.handlers.end);
      el.removeEventListener(_touchUi2.default.touchLeave, this.handlers.end);
    }
  }, {
    key: 'zoomMoveHandler',
    value: function zoomMoveHandler(e) {
      var moves = this.touch.getMoves();

      if (!this.zoomStartAt && Math.abs(moves.diffTouchDistance) > 20) {
        _touchUi2.default.fireTouchEvent(e.target, 'zoom-start', e, { moves: moves });
        this.zoomStartAt = new Date().getTime();
      } else if (this.zoomStartAt) {
        _touchUi2.default.fireTouchEvent(e.target, 'zoom-move', e, { moves: moves });
      }
    }
  }, {
    key: 'zoomEndHandler',
    value: function zoomEndHandler(e) {
      if (this.zoomStartAt) {
        _touchUi2.default.fireTouchEvent(e.target, 'zoom-end', e);
      }
      this.zoomStartAt = null;
      this.removeZoomListeners(e.target);
    }
  }]);

  return TouchZoom;
}();

/* alias of `new TouchZoom(..)` */


_touchUi2.default.zoomable = function () {
  return new (Function.prototype.bind.apply(TouchZoom, [null].concat(Array.prototype.slice.call(arguments))))();
};

exports.default = TouchZoom;
module.exports = exports['default'];

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
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

var _touchUi = __webpack_require__(0);

var _touchUi2 = _interopRequireDefault(_touchUi);

var _touchDrag = __webpack_require__(1);

var _touchDrag2 = _interopRequireDefault(_touchDrag);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TouchResize = function () {
  function TouchResize(options) {
    _classCallCheck(this, TouchResize);

    this.els = [];
    this.touch = new _touchUi2.default();
    this.startWidth;
    this.startHeight;
    this.overlayEls = [];

    var defaultOptions = { positions: 'right, bottom' };
    var args = _touchUi2.default.parseArguments([].concat(Array.prototype.slice.call(arguments)), defaultOptions);

    var _ref = [args.elements, args.options];
    this.els = _ref[0];
    this.options = _ref[1];

    console.log('TouchResize', 'this.els', this.els, 'this.options', this.options);

    window.addEventListener('load', this.init.bind(this));
  }

  _createClass(TouchResize, [{
    key: 'init',
    value: function init() {
      var _this = this;

      this.els.forEach(function (resizeEl) {
        _this.overlayEls = _this.createResizeOverlays(_this.options);
        _this.styleOverlayEls(resizeEl, _this.overlayEls);
        _this.overlayEls.forEach(function (overlayEl) {
          resizeEl.parentNode.insertBefore(overlayEl, resizeEl.nextSibling);
          _this.applyDraggable(overlayEl, resizeEl);
        });
      });

      this.dragStartAt = null;
    }
  }, {
    key: 'resizeStartHandler',
    value: function resizeStartHandler(e) {
      var resizeEl = e.resizeFor;
      var resizeElBCR = resizeEl.getBoundingClientRect(); // top, left, width, height
      var resizePosition = e.target.getAttribute('resize-direction');

      this.startWidth = resizeElBCR.width;
      this.startHeight = resizeElBCR.height;

      _touchUi2.default.fireTouchEvent(e.resizeFor, 'resize-start', e, { resizePosition: resizePosition });
    }
  }, {
    key: 'resizeMoveHandler',
    value: function resizeMoveHandler(e) {
      var resizeEl = e.resizeFor;
      var resizePosition = e.target.getAttribute('resize-position');
      var move = this.touch.getMove();

      if (resizePosition === 'right') {
        resizeEl.style.width = this.startWidth + move.x + 'px';
      }
      if (resizePosition === 'bottom') {
        resizeEl.style.height = this.startHeight + move.y + 'px';
      }

      _touchUi2.default.fireTouchEvent(e.resizeFor, 'resize-move', e, {
        move: move,
        resizePosition: resizePosition
      });
    }
  }, {
    key: 'resizeEndHandler',
    value: function resizeEndHandler(e) {
      var move = this.touch.getMove();
      var resizePosition = e.target.getAttribute('resize-position');

      this.styleOverlayEls(e.resizeFor, this.overlayEls);
      _touchUi2.default.fireTouchEvent(e.resizeFor, 'resize-end', e, {
        move: move,
        resizePosition: resizePosition
      });
    }
  }, {
    key: 'createResizeOverlays',
    value: function createResizeOverlays(options) {
      var _this2 = this;

      /* eslint no-unused-vars: 0 */
      var overlayEl = void 0;
      var top = void 0,
          left = void 0,
          width = void 0,
          height = void 0,
          cursor = void 0;
      var positions = options.positions.split(',').map(function (p) {
        return p.trim();
      });

      positions.forEach(function (key) {
        overlayEl = document.createElement('div');
        overlayEl.setAttribute('resize-position', key);
        _this2.overlayEls.push(overlayEl);
      });

      return this.overlayEls;
    }
  }, {
    key: 'styleOverlayEls',
    value: function styleOverlayEls(resizeEl, overlayEls) {
      var resizeElBCR = resizeEl.getBoundingClientRect(); // top, left, width, height
      var top = void 0,
          left = void 0,
          width = void 0,
          height = void 0,
          cursor = void 0;

      overlayEls.forEach(function (overlayEl) {
        var key = overlayEl.getAttribute('resize-position');

        // set style including position
        top = key === 'bottom' ? window.scrollY + resizeElBCR.bottom - 2 : key === 'right' ? window.scrollY + resizeElBCR.top + 1 : 0;
        left = key === 'bottom' ? window.scrollX + resizeElBCR.left - 1 : key === 'right' ? window.scrollX + resizeElBCR.right - 2 : 0;
        width = key === 'bottom' ? resizeElBCR.width - 2 : key === 'right' ? 3 : 0;
        height = key === 'bottom' ? 3 : key === 'right' ? resizeElBCR.height - 2 : 0;
        cursor = key === 'bottom' ? 'ns-resize' : key === 'right' ? 'ew-resize' : 0;

        overlayEl.style.position = 'absolute';
        overlayEl.style.top = top + 'px';
        overlayEl.style.left = left + 'px';
        overlayEl.style.width = width + 'px';
        overlayEl.style.height = height + 'px';
        overlayEl.style.cursor = cursor;
        overlayEl.style.backgroundColor = 'rgba(0,0,0,0.0)';
      });
    }
  }, {
    key: 'applyDraggable',
    value: function applyDraggable(overlayEl, resizeForEl) {
      var _this3 = this;

      var drags = [],
          touchDrag = void 0;
      var resizePosition = void 0,
          dragAxis = void 0;

      // add event listeners
      resizePosition = overlayEl.getAttribute('resize-position');
      dragAxis = resizePosition === 'right' ? 'x' : resizePosition === 'bottom' ? 'y' : 'xy';
      touchDrag = new _touchDrag2.default(overlayEl, { axis: dragAxis, recoverWhenEnd: false });

      overlayEl.addEventListener('hold', function (e) {
        e.target.style.boxShadow = '0px 0px 2px 2px rgba(255,255,0,1)';
      });

      overlayEl.addEventListener(_touchUi2.default.touchEnd, function (e) {
        e.target.style.boxShadow = '';
      });

      overlayEl.addEventListener('drag-start', function (e) {
        e.resizeFor = resizeForEl;
        _this3.resizeStartHandler(e);
      });
      overlayEl.addEventListener('drag-move', function (e) {
        e.resizeFor = resizeForEl;
        _this3.resizeMoveHandler(e);
      });
      overlayEl.addEventListener('drag-end', function (e) {
        e.resizeFor = resizeForEl;
        _this3.resizeEndHandler(e);
      });

      return overlayEl;
    }
  }]);

  return TouchResize;
}();

/* alias of `new TouchDrag(..)` */


_touchUi2.default.resizable = function () {
  return new (Function.prototype.bind.apply(TouchResize, [null].concat(Array.prototype.slice.call(arguments))))();
};

exports.default = TouchResize;
module.exports = exports['default'];

/***/ })
/******/ ]);
});
//# sourceMappingURL=touch-ui.js.map