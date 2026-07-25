# Viewake

Direction-aware scroll reveal animations with a small framework-independent core.

## Install

```bash
npm install viewake
```

```js
import "viewake/styles.css";
import { init } from "viewake";

init();
```

```html
<article
  data-viewake="fade-up"
  data-viewake-mode="replay"
  data-viewake-delay="150"
  data-viewake-duration="900"
  data-viewake-easing="ease-out"
>
  Content
</article>
```

## Data attributes

| Attribute | Default | Purpose |
| --- | --- | --- |
| `data-viewake` | required | Animation preset or custom animation name |
| `data-viewake-mode` | `once` | `once` or `replay` |
| `data-viewake-delay` | `0` | Wait before motion, in milliseconds |
| `data-viewake-duration` | `600` | Motion duration, in milliseconds |
| `data-viewake-easing` | smooth cubic Bézier | Any valid CSS easing |

`once` reveals an element once and leaves it visible. `replay` also leaves
content visible above the viewport, but resets after the element is completely
below the viewport again.

## Global options

```js
const controller = init({
  threshold: 0.2,
  mode: "once",
  delay: 0,
  duration: 600,
  easing: "cubic-bezier(0.22, 1, 0.36, 1)",
  respectReducedMotion: true,
});

controller.refresh();
controller.destroy();
```

## Presets

- Fade: `fade`, four directions, and four diagonal variants
- Slide: `slide-up`, `slide-down`, `slide-left`, `slide-right`
- Zoom: `zoom-in`, `zoom-out`, and directional variants
- Flip: `flip-up`, `flip-down`, `flip-left`, `flip-right`

JavaScript only manages `data-viewake-state`. Add custom animation visuals in CSS:

```css
[data-viewake="blur-up"][data-viewake-state="pending"] {
  filter: blur(12px);
  transform: translate3d(0, 24px, 0);
}
```

Viewake is ESM-first, safe to import during SSR, honors reduced motion by
default, and keeps content visible when `IntersectionObserver` is unavailable.

MIT
