import TouchUI from './touch-ui';
import TouchDrag from './touch-drag';
import TouchDrop from './touch-drop';
import TouchSwipe from './touch-swipe';
import TouchPan from './touch-pan';
import TouchResize from './touch-resize';
export {
  TouchUI,
  TouchDrag,
  TouchDrop,
  TouchSwipe,
  TouchPan,
  TouchResize
};

// for browser environment with `<script>` tag
window && (window.TouchUI = TouchUI);
