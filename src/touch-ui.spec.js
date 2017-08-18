import test from 'ava';
import sinon from 'sinon';
import TouchUI from './touch-ui';
// https://github.com/avajs/ava-assert

// sinon DOM test example
//  from: https://codeutopia.net/blog/2016/05/23/sinon-js-quick-tip-how-to-stubmock-complex-objects-such-as-dom-objects/
//
// document.body.getElementsByTagName('div')[0]
//   .getAttribute('data-example');
//
// var els = sinon.stub(document.body, 'getElementsByTagName');
// els.withArgs(‘div’).reurns([{
//   getAttribute: sinon.stub();
// }]);
// els.withArgs(‘div’).reurns([{
//   getAttribute: sinon.stub().withArgs(0).returns('foo');
// }]);

// t.pass([message])  Passing assertion.
// t.fail([message])  Failing assertion.
// t.truthy(value, [message])  Assert that value is truthy.
// t.falsy(value, [message])  Assert that value is falsy.
// t.true(value, [message]) Assert that value is true.
// t.false(value, [message]) Assert that value is false.
// t.is(value, expected, [message])  Assert that value is equal to expected.
// t.not(value, expected, [message]) Assert that value is not equal to expected.

let fireTouchEventStub, calcMoveStub;

test.before(t => {
  fireTouchEventStub = sinon.stub(TouchUI, 'fireTouchEvent').returns(1);
  calcMoveStub = sinon.stub(TouchUI, 'calcMove').returns('calcMove');
});

test.after(t => {
  fireTouchEventStub.restore();
  calcMoveStub.restore();
});

test('singleton test', t => {
  let stub = sinon.stub(TouchUI.prototype, 'init').returns(1);
  let a = new TouchUI();
  let b = new TouchUI();

  stub.restore();

  t.is(a, b);
});

test('init()', t => {
  let spy = sinon.spy(document.body, 'addEventListener');
  let touch = new TouchUI();

  touch.init();

  t.is(spy.callCount, 4);
});

test.serial.cb('touchStartHandler()', t => {
  let touch = new TouchUI();
  let event = {target: 'target'};

  touch.lastTouchEventName = null;
  touch.touchStartHandler(event);

  setTimeout(() => {
    // t.truthy(fireTouchEventStub.getCall(0).args[0], 'target');
    // t.truthy(fireTouchEventStub.getCall(0).args[1], 'hold');
    t.truthy(fireTouchEventStub.calledWith('target', 'hold', event));
    t.end();
  }, TouchUI.HOLD_TIME + 100);
});

test('touchMoveHandler()', t => {
  let touch = new TouchUI();
  let event = {target: 'target'};

  let stub = sinon.stub(touch, 'getMove').returns({
    distance: TouchUI.SMALL_MOVE + 1
  });

  touch.prevTouches = 1;
  touch.holdTimer = () => {};
  touch.tapTimer  = () => {};

  touch.touchMoveHandler(event);
  stub.restore();

  t.is(touch.endTouches[0].target, 'target');
  t.is(touch.lastMove, 'calcMove');
  // t.truthy(spy.calledTwice());
  t.is(touch.prevTouches[0].target, 'target');
});

test.serial('touchEndHandler()', t => {
  let touch = new TouchUI();
  let spy = sinon.spy(touch, 'touchResetHandler');
  let event = {target: 'target'};
  let stub = sinon.stub(touch, 'getMove').returns({
    distance: TouchUI.SMALL_MOVE - 1
  });

  touch.touchEndHandler(event);
  stub.restore();

  t.truthy(fireTouchEventStub.calledWith('target', 'tap', event));
  t.is(touch.lastTouchEventName, 'tap');
  t.truthy(spy.called);
});

test('touchEndHandler', t => t.pass()); // TODO
test.cb('touchResetHandler()', t => { t.pass(); t.end(); }); // TODO
test('getMove()', t => t.pass()); // TODO
test('TouchUI.isTouch()', t => t.pass()); // TODO
test('TouchUI.fireTouchEvent()', t => t.pass()); // TODO
test('TouchUI.getStyle()', t => t.pass()); // TODO
test('TouchUI.disableDefaultTouchBehaviour()', t => t.pass()); // TODO
test('TouchUI.calcMove()', t => t.pass()); // TODO
test('TouchUI.getDistance()', t => t.pass()); // TODO
test('TouchUI.getDirection()', t => t.pass()); // TODO
test('TouchUI.getOverlappingEl()', t =>  t.pass()); // TODO
