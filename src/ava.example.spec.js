import test from 'ava';
import sinon from 'sinon';

let consoleStub;

test.before(t => {
  consoleStub = sinon.stub(console, 'log').returns(() => {});
});

test.beforeEach(t => console.log('before each')); // before each test
test.after(t => console.log('after 1'));          // after all tests
test.after(t => console.log('after 2'));
test.after.always(t => consoleStub.restore()); // even wih fail
test.afterEach(t => console.log('after each'));      // after each test
test.afterEach.always(t => console.log('after each always')); // even wih fail

test('stub instance example', t => {
  // let stub = sinon.stub(TouchUI.prototype, 'init').returns(1);
  // stub.restore();
  t.pass();
});

test('spy example', t => {
  // let spy = sinon.spy(document.body, 'addEventListener');
  // t.is(spy.callCount, 4);
  t.pass();
});

test.cb('callback example', t => {
  setTimeout(() => {
    // t.truthy(fireTouchEventStub.getCall(0).args[0], 'target');
    // t.truthy(fireTouchEventStub.getCall(0).args[1], 'hold');
    t.end();
  }, 10);
});

test.serial('serial example', t => {
  console.log('this always first');
  t.pass();
});

test.serial('serial example', t => {
  console.log('this always second');
  t.pass();
});