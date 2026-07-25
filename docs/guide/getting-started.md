# Getting started

This page takes you from an empty project to a working reveal and explains every line.

## 1. Install

Use npm in projects with a `package.json`:

```bash
npm install viewake
```

For a plain HTML file, follow [CDN and plain HTML](/guide/cdn) instead.

## 2. Import the CSS and start the observer

```js
import "viewake/styles.css";
import { init } from "viewake";

init();
```

The stylesheet owns the visual effects. `init()` finds every `[data-viewake]` element and observes its scroll position.

## 3. Mark an element

```html
<article data-viewake="fade-up">
  I fade in while moving upward.
</article>
```

## 4. Add mode and delay

```html
<article
  data-viewake="zoom-in"
  data-viewake-mode="replay"
  data-viewake-delay="200"
  data-viewake-duration="900"
  data-viewake-easing="ease-out"
>
  I start 200ms after the trigger.
</article>
```

`data-viewake` selects an animation, `data-viewake-mode` selects `once` or
`replay`, `data-viewake-delay` waits before starting, and
`data-viewake-duration` controls playback time. Both time values use
milliseconds without an `ms` suffix. `data-viewake-easing` controls the speed
curve.

## 5. Change the trigger point

```js
init({ threshold: 0.3 });
```

This triggers after roughly 30% of the element intersects the viewing area. The default is `0.15`.

## What the library changes

```html
<!-- waiting below -->
<article data-viewake="fade-up" data-viewake-state="pending">

<!-- revealed -->
<article data-viewake="fade-up" data-viewake-state="active">
```

Do not write `data-viewake-state` yourself. JavaScript manages state while CSS renders motion.

## Completion check

- You revealed an element with `data-viewake`.
- You verified a 500ms delay.
- You compared the second downward pass in once and replay modes.
- You can explain the difference between threshold and delay.
- You can explain the difference between delay and duration.

Continue to the [data attribute model](/guide/data-attributes).
