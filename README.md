updating..
Note: Here are some useful tips when dealing with touch events

Thanks to: 
  - https://www.html5rocks.com/en/mobile/touchandmouse/
  - http://www.creativebloq.com/javascript/make-your-site-work-touch-devices-51411644

1. Tap(touchstart/touchend) also fires click
  
  Solution: Do not use click event, use tap(touchstart/touchend) event only

2. Target of `mousemove` event is not an element that touch started, but mouse is over

  Solution: Do not use `mousemove` event for touch devices, but touchmove by emulating it.

   Difference between mousemove and touchmove
    * event.target
      * touchmove: the element touch started
      * mousemove: the element where the mouse is over

3. `touchmove` event does not work when element is removed from DOM.

  Solution:  Add touchevents when touch starts
    * register touchmove/touchend/touchcancel when touchstart happens
    * unregister touchmove/touchend/touchcancel when on touchend/touchcancel

4. touch events can be messed up with scroll events

  Solution: Apply touch events only for a small portion of your page and disable all scroll events for that element by limitting the scope of your touch handlers as much as possible.


The difference between MouseEvent and TouchEvent

    interface MouseEvent : UIEvent {
      readonly attribute long screenX;
      readonly attribute long screenY;
      readonly attribute long clientX;
      readonly attribute long clientY;
      readonly attribute boolean ctrlKey;
      readonly attribute boolean shiftKey;
      readonly attribute boolean altKey;
      readonly attribute boolean metaKey;
      readonly attribute unsigned short button;
      readonly attribute EventTarget relatedTarget;
      void initMouseEvent(...);
    };


    interface TouchEvent : UIEvent {
      readonly attribute TouchList touches;
      readonly attribute TouchList targetTouches;
      readonly attribute TouchList changedTouches;
      readonly attribute boolean altKey;
      readonly attribute boolean metaKey;
      readonly attribute boolean ctrlKey;
      readonly attribute boolean shiftKey;
    };

    interface Touch {
      readonly attribute long identifier;
      readonly attribute EventTarget target; //
      readonly attribute long screenX; //
      readonly attribute long screenY; //
      readonly attribute long clientX; //
      readonly attribute long clientY; //
      readonly attribute long pageX;
      readonly attribute long pageY;
    };

