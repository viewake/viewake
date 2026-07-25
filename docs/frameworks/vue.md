# Vue 3

Do not call `init()` when you use `viewake-vue`. Its directive observes and cleans up the real DOM element through Vue's mount, update, and unmount lifecycle.

## Choose the integration

| Situation | Use |
| --- | --- |
| Use `v-viewake` across the app | global plugin |
| Use it in one component only | local `vViewake` directive |
| Observe plain HTML outside Vue | core `init()` |

The global plugin is the simplest default for most Vue applications.

## 1. Install

```bash
npm install viewake viewake-vue
```

## 2. Recommended: register the plugin once

```ts
// src/main.ts
import { createApp } from "vue";
import { ViewakePlugin } from "viewake-vue";
import "viewake/styles.css";

import App from "./App.vue";

createApp(App)
  .use(ViewakePlugin)
  .mount("#app");
```

Every component can now use the directive without another import:

```vue
<template>
  <article v-viewake="'fade-up'">
    Reveal once
  </article>
</template>
```

That is the complete setup. Do not add a core `init()` call.

The outer double quotes belong to the HTML attribute. The inner single quotes create a JavaScript string. Without them, Vue looks for a variable named `fade-up`.

## 3. Pass an object for element options

```vue
<template>
  <article
    v-viewake="{
      animation: 'zoom-in',
      mode: 'replay',
      delay: 200,
      duration: 900,
      easing: 'ease-out'
    }"
  >
    Reveal again
  </article>
</template>
```

The directive adds no wrapper. It writes the configuration to the real `article`.

```html
<article
  data-viewake="zoom-in"
  data-viewake-mode="replay"
  data-viewake-delay="200"
  data-viewake-duration="900"
  data-viewake-easing="ease-out"
>
  Reveal again
</article>
```

When a reactive binding value changes, the directive destroys the previous controller and reconnects with the new values.

## 4. Configure application defaults

```ts
// src/main.ts
import { createApp } from "vue";
import { createViewakePlugin } from "viewake-vue";
import "viewake/styles.css";

import App from "./App.vue";

createApp(App)
  .use(
    createViewakePlugin({
      mode: "replay",
      threshold: 0.2,
      duration: 700,
    }),
  )
  .mount("#app");
```

An element that omits `mode` now uses the plugin's `replay` default:

```vue
<article v-viewake="'fade-up'">
  Uses the plugin defaults
</article>
```

Explicit element values win over plugin defaults:

```vue
<article
  v-viewake="{
    animation: 'fade-up',
    mode: 'once',
    duration: 400
  }"
>
  Uses once and 400ms
</article>
```

## 5. Local directive for one component

```vue
<script setup lang="ts">
import { vViewake } from "viewake-vue";
</script>

<template>
  <section v-viewake="'slide-up'">
    Used only in this component
  </section>
</template>
```

In `<script setup>`, the camelCase `vViewake` variable is exposed as the `v-viewake` directive. Import the CSS once from `main.ts`, not repeatedly in every component.

## 6. Lifecycle

```text
Vue mounted
→ write data-viewake-* attributes
→ create a controller
→ observe the real element
→ reconnect when the binding changes
→ Vue unmounted
→ destroy the controller and remove owned state
```

Unlike the React component adapter, the Vue directive never inserts an extra wrapper.

## FAQ

### Do I call `init()` in Vue?

No. The plugin or local directive starts observation for each element.

### Should I use both plugin and local directive?

No. Choose based on whether the directive is app-wide or local to one component.

### Why does `v-viewake="fade-up"` fail?

Vue treats `fade-up` as an expression. Pass a string with `v-viewake="'fade-up'"`.

## Completion check

- Register the stylesheet and plugin once in `main.ts`.
- Reveal an element with only `v-viewake="'fade-up'"`.
- Configure replay, delay, and duration with an object value.
- Verify plugin defaults and an element-level override.
- Explain why the plugin and local directive are alternatives.
