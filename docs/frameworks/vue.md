# Vue 3

Install the core and Vue adapter.

```bash
npm install viewake viewake-vue
```

## Plugin

Register the directive once.

```ts
import { createApp } from "vue";
import { ViewakePlugin } from "viewake-vue";
import "viewake/styles.css";

import App from "./App.vue";

createApp(App)
  .use(ViewakePlugin)
  .mount("#app");
```

Use `v-viewake` with an animation name or configuration object.

```vue
<template>
  <article v-viewake="'fade-up'">
    Wake once
  </article>

  <article
    v-viewake="{
      animation: 'zoom-in',
      mode: 'replay',
      delay: 200,
      duration: 900,
      easing: 'ease-out'
    }"
  >
    Wake again
  </article>
</template>
```

The directive adds `data-*` attributes to the real element:

```html
<article data-viewake="zoom-in" data-viewake-mode="replay" data-viewake-delay="200" data-viewake-duration="900" data-viewake-easing="ease-out">
```

## Local directive

Use the exported directive without installing a plugin.

```vue
<script setup lang="ts">
import { vViewake } from "viewake-vue";
import "viewake/styles.css";
</script>

<template>
  <section v-viewake="'fade-up'">Content</section>
</template>
```

## Plugin defaults

Create a configured plugin.

```ts
import { createViewakePlugin } from "viewake-vue";

app.use(
  createViewakePlugin({
    mode: "replay",
    threshold: 0.2,
  }),
);
```

The directive creates a controller in `mounted` and destroys it in
`unmounted`.

Keep visual values in CSS:

```css
.feature-card {
  --viewake-duration: 500ms;
  --viewake-distance: 20px;
}
```

## Practice completion

- Use `v-viewake` with both a string and an object value.
- Explain the difference between the global plugin and local directive.
- Confirm that removing the component also cleans up its observer.
