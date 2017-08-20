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
<a href="https://rawgit.com/allenhwkim/touch-ui/master/demo/index.html#tap-hold">
  <img width="30%" align="top" src="https://user-images.githubusercontent.com/1437734/29497247-e940aee2-85b2-11e7-86c1-a41fac237a5e.png"><a>
<a href="https://rawgit.com/allenhwkim/touch-ui/master/demo/index.html#drag">
  <img width="30%" align="top" src="https://user-images.githubusercontent.com/1437734/29497437-83b44a04-85b5-11e7-9198-99d96bddbca7.png"><a>
<a href="https://rawgit.com/allenhwkim/touch-ui/master/demo/index.html#drop">
  <img width="30%" align="top" src="https://user-images.githubusercontent.com/1437734/29497450-b1e8aa8c-85b5-11e7-9348-47b0369564a6.png"><a>
<a href="https://rawgit.com/allenhwkim/touch-ui/master/demo/index.html#swipe">
  <img width="30%" align="top" src="https://user-images.githubusercontent.com/1437734/29497453-e31536ca-85b5-11e7-943f-d8b36500a55e.png"><a>
<a href="https://rawgit.com/allenhwkim/touch-ui/master/demo/index.html#pan">
  <img width="30%" align="top" src="https://user-images.githubusercontent.com/1437734/29497475-57e79f92-85b6-11e7-8459-0ff854481f13.png"><a>
<a href="https://rawgit.com/allenhwkim/touch-ui/master/demo/index.html#resize">
  <img width="30%" align="top" src="https://user-images.githubusercontent.com/1437734/29497488-8bfab440-85b6-11e7-8c8a-38cc9d1d9d45.png"><a>

Supported Events  
e.g. `el.addEventListener('drag-move', e => console.log(e));`

* `tap` / `double-tap` / `triple-tap`
* `hold` / `tap-and-hold` / `double-tap-and-hold`
* `drag-start` / `drag-move` / `drag-end` 
* `drag-enter` / `drag-leave` / `drop`
* `swipe-left` / `swipe-right` / `swipe-up` / `swipe-down`
* `pan-start` / `pan-move` / `pan-end`
* `resize-start` / `resize-move` / `resize-end`

## Overview

  * This library is very focused on simplicity and design
  * All events works for desktop browsers, of course, as well as mobile browsers.
  * For simplicity, it does not deal with multi-touch events. e.g. two finger zoom, two finger swipe, etc. The reason is that each mobile browser has its own way of dealing with multi-touch events and this library does not make another hacks on the top of the default behaviour, which makes less maintainable and more complicated.
  * It fires a Javascript event without using any callbacks, so that you can add event listener like a vanilla Javascript.
    This is unlike other touch library, which you have to learn their own way to use their own callbacks.
    `myEl.addEventListener('drag-move', functione(e) {console.log(e)})`

## Usage

Include script tag into your html

      <div class="draggable">Drag This</div>
      <script src="https://unpkg.com/touch-ui/dist/touch-ui.min.js"></script>
      <script>
        TouchUI.draggable('.draggable', {axis: 'xy'});
      </script>

## Install

1. install touch-ui node module

        $ npm install touch-ui --save-dev

2. Import TouchUI and use

        import TouchUI from './touch-ui';
        TouchUI.draggable(dragEls[0], {axis: 'xy'});

## Examples


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
  
### Resize example

    let resizableEl = document.querySelector('.resizable');
    let resize = TouchUI.resizable(resizableEl, {positions: 'right'});
    let startWidth, startHeight;

    resizableEl.addEventListener('resize-start', e => console.log(e) );
    resizableEl.addEventListener('resize-move', e => console.log(e) );
    resizableEl.addEventListener('resize-end', e => console.log(e) );


Please take a look at the various examples used on demos.
