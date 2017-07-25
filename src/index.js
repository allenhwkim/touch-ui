import TouchUI from './touch-ui';
import TouchDrag from './touch-drag';
import TouchDrop from './touch-drop';
import TouchSwipe from './touch-swipe';
export {
  TouchUI,
  TouchDrag,
  TouchDrop,
  TouchSwipe
};

// for browser environment with `<script>` tag
if (window) {
  window.TouchUI = TouchUI;
  window.TouchDrag = TouchDrag;
  window.TouchDrop = TouchDrop;
  window.TouchSwipe = TouchSwipe;
}