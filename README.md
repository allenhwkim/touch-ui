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
        TouchUI.draggable(dragEls[0], {axis: 'xy'});
      </script>

## Usage


### Tap and hold example

    let tapHoldEl = document.querySelector('#tap-hold');
    tapHoldEl.addEventListener('double-tap', e => console.log(e.eventName));

### Drag example

    let draggable = document.querySelector('.draggable');
    TouchUI.draggable(draggable, {axis: 'xy'});

    draggable.addEventListener('drag-start', e => console.log(e) );
    draggable.addEventListener('drag-move', e => console.log(e) );
    draggable.addEventListener('drag-end', e => console.log(e) );
    
### Drag/Drop example

    let draggable = document.querySelector('.draggable');
    let dropzone  = document.querySelector('.dropzone');
    TouchUI.draggable(draggable);
    TouchUI.droppable(dropzone);

    dropzone.addEventListener('drag-enter', e => console.log(e) );
    dropzone.addEventListener('drag-leave', e => console.log(e) );
    dropzone.addEventListener('drop',       e => e.target.appendChild(e.dragEl) );

### Swipe example
    
    let swipable = document.querySelectorAll('.swipable');
    TouchUI.swipable(swipable);

    el.addEventListener('swipe-right', e => console.log(e));

### Pan example

    let panTestEl = document.querySelector('#pan-test');
    TouchUI.pannable(panTestEl);

    panTestEl.addEventListener('pan-start', e => console.log(e) );
    panTestEl.addEventListener('pan-move', e => console.log(e) );
  
### Zoom example

    let zoomTestEl = document.querySelector('#zoom-test');
    let imgEl = document.querySelector('#zoom-test img');
    let zoomable = TouchUI.zoomable('#zoom-test');
    let moves, matches, imgScale;

    imgEl.style.transform = 'scale(1)';
    zoomTestEl.addEventListener('zoom-start', e => { // get the initial scale
      matches = imgEl.style.transform.match(/scale\((.*)\)/);
      imgScale = matches ? matches[1] * 1 : 0;
    });

    zoomTestEl.addEventListener('zoom-move', e => { // update scale with moving distance
      scale = imgScale + (e.moves.diffTouchDistance/500);
      imgEl.style.transform = imgEl.style.transform.replace(/scale\((.*)\)/, (_, $1) => `scale(${scale})`);
    });

### Resize example

    let resizableEl = document.querySelector('.resizable');
    let resize = TouchUI.resizable(resizableEl, {positions: 'right'});
    let startWidth, startHeight;

    resizableEl.addEventListener('resize-start', e => console.log(e) );
    resizableEl.addEventListener('resize-move', e => console.log(e) );
    resizableEl.addEventListener('resize-end', e => console.log(e) );


Please take a look at the various examples used on demos.
