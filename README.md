Touch-UI
---------
Fire cross-browser-convenient touch events

Tested with
<img src="https://ci.testling.com/_/images/chrome.png" width=32 />
<img src="https://ci.testling.com/_/images/firefox.png" width=32 />
<img src="https://ci.testling.com/_/images/safari.png" width=32 />
<img src="https://ci.testling.com/_/images/iphone.png" width=32 />
<img src="https://ci.testling.com/_/images/ipad.png" width=32 />
<img src="https://ci.testling.com/_/images/android-browser.png" width=32 />

DEMO
====
* [tap/hold](https://rawgit.com/allenhwkim/touch-ui/master/demo/index.html#tap-hold)
* [drag](https://rawgit.com/allenhwkim/touch-ui/master/demo/index.html#drag)
* [drop](https://rawgit.com/allenhwkim/touch-ui/master/demo/index.html#drop)
* [swipe](https://rawgit.com/allenhwkim/touch-ui/master/demo/index.html#swipe)
* [pan](https://rawgit.com/allenhwkim/touch-ui/master/demo/index.html#pan)
* [zoom](https://rawgit.com/allenhwkim/touch-ui/master/demo/index.html#zoom)
* [resize](https://rawgit.com/allenhwkim/touch-ui/master/demo/index.html#resize)

Events
=======
* tap / double-tap / triple-tap
* hold / tap-and-hold / double-tap-and-hold
* drag-start / drag-move / drag-end 
* drag-enter / drag-leave / drop
* swipe-left / swipe-right / swipe-up / swipe-down
* pan-start / pan-move / pan-end
* zoom-start / zoom-move / zoom-end
* resize-start / resize-move / resize-end

## Install

1. install touch-ui node module

        $ npm install touch-ui --save-dev

2. Import TouchUI and use

        import TouchUI from './touch-ui';
        TouchUI.draggable(dragEls[0], {axis: 'xy'});

## Use Without Install

Include script tag into your html

      <script src="https://unpkg.com/touch-ui/dist/touch-ui.min.js"></script>
      <script>
        import TouchUI from './touch-ui';
        TouchUI.draggable(dragEls[0], {axis: 'xy'});
      </script>

## Usage


      import TouchUI from 'touch-ui';
    
      let dragEl = Array.from(document.querySelector('.draggable'));
      TouchUI.draggable(dragEl, {axis: 'xy'});

      el.addEventListener('drag-start', e => setBgText(el, e.eventName) );
      el.addEventListener('drag-move',  e => setBgText(el, e.eventName) );
      el.addEventListener('drag-end',   e => setBgText(el, e.eventName) );

Please take a look at the various examples used on demos.