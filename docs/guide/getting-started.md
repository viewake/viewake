# Getting started

Start by choosing **one** integration for your project. Not every environment calls `init()`.

## 1. Choose your environment

| Project | Install | Starts observation | `init()` |
| --- | --- | --- | --- |
| Plain JavaScript with Vite/Webpack | `viewake` | `init()` | required |
| React or Next.js | `viewake` + `viewake-react` | `<Viewake>` or `useViewake()` | not used |
| Vue 3 | `viewake` + `viewake-vue` | `v-viewake` | not used |
| HTML without a bundler | CDN CSS and script | `Viewake.init()` | required |

::: tip Pick one integration
Do not render `<Viewake>` and also scan that same element with core `init()`. The React and Vue adapters already manage observation through their framework lifecycle.
:::

## 2. Smallest example for each environment

### Plain JavaScript

```bash
npm install viewake
```

```js
import "viewake/styles.css";
import { init } from "viewake";

init();
```

```html
<article data-viewake="fade-up">
  I reveal while moving upward.
</article>
```

`init()` finds every `[data-viewake]` element in the document.

### React or Next.js

```bash
npm install viewake viewake-react
```

```tsx
import { Viewake } from "viewake-react";
import "viewake/styles.css";

export function Feature() {
  return (
    <Viewake animation="fade-up">
      Feature content
    </Viewake>
  );
}
```

Do not call `init()` here. The component observes its own `div`. Use the hook only when an extra wrapper is not valid. See [React and Next.js](/frameworks/react-next).

### Vue 3

```bash
npm install viewake viewake-vue
```

```ts
// src/main.ts
import { createApp } from "vue";
import { ViewakePlugin } from "viewake-vue";
import "viewake/styles.css";

import App from "./App.vue";

createApp(App).use(ViewakePlugin).mount("#app");
```

```vue
<article v-viewake="'fade-up'">
  Feature content
</article>
```

Do not call `init()` here either. The directive observes the real `article`. See [Vue 3](/frameworks/vue).

### Plain HTML and CDN

Use a stylesheet link, a global script, and `Viewake.init()`. Follow the complete [CDN and plain HTML guide](/guide/cdn).

## 3. Read the shared `data-*` contract

Every integration produces the same DOM contract:

```html
<article
  data-viewake="zoom-in"
  data-viewake-mode="replay"
  data-viewake-delay="200"
  data-viewake-duration="900"
  data-viewake-easing="ease-out"
>
  I reveal after 200ms.
</article>
```

React props and Vue bindings generate these attributes. Plain JavaScript and CDN users write them directly.

## 4. Once and replay

- `once`: reveal once, stay visible, and never replay
- `replay`: stay visible above the viewport, reset only after returning completely below, and replay on the next downward pass

Replay is not a mirror mode that hides content whenever it leaves the viewport. Read [once and replay](/guide/modes) for the full scroll sequence.

## 5. Separate threshold, delay, and duration

```js
init({ threshold: 0.3 });
```

- `threshold`: how much of the element must intersect before the trigger
- `delay`: how long to wait after the trigger
- `duration`: how long the CSS transition runs

React passes threshold through `options`. Vue can set it in a configured plugin.

## 6. Verify the result in DevTools

```html
<!-- waiting below -->
<article data-viewake="fade-up" data-viewake-state="pending">

<!-- revealed -->
<article data-viewake="fade-up" data-viewake-state="active">
```

Do not write `data-viewake-state` yourself. Viewake owns it.

## Completion check

- Choose plain JS, React, Vue, or CDN.
- Reveal an element with only that integration.
- Explain why React and Vue adapters do not call `init()`.
- Compare the second downward pass in once and replay.
- Explain threshold, delay, and duration.
- Observe the `pending → active` change in DevTools.

Continue to the [data attribute model](/guide/data-attributes).
