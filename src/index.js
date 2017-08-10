import TouchUI from './touch-ui';
import TouchDrag from './touch-drag';
import TouchDrop from './touch-drop';
import TouchSwipe from './touch-swipe';
import TouchPan from './touch-pan';
import TouchZoom from './touch-zoom';
export {
  TouchUI,
  TouchDrag,
  TouchDrop,
  TouchSwipe,
  TouchPan,
  TouchZoom
};

// for browser environment with `<script>` tag
window && (window.TouchUI = TouchUI);
