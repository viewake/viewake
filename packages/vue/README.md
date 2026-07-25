# viewake-vue

Vue 3 directive and plugin for Viewake.

## Install

```bash
npm install viewake viewake-vue
```

## Register globally

```ts
import { createApp } from "vue";
import { ViewakePlugin } from "viewake-vue";
import "viewake/styles.css";
import App from "./App.vue";

createApp(App).use(ViewakePlugin).mount("#app");
```

```vue
<article
  v-viewake="{
    animation: 'zoom-in',
    mode: 'replay',
    delay: 150,
    duration: 900,
    easing: 'ease-out'
  }"
>
  Content
</article>
```

A string selects only the animation:

```vue
<section v-viewake="'fade-up'">Content</section>
```

## Register locally

```vue
<script setup lang="ts">
import { vViewake } from "viewake-vue";
import "viewake/styles.css";
</script>

<template>
  <section v-viewake="'slide-up'">Content</section>
</template>
```

The directive starts observation on `mounted`, reapplies changed settings on
`updated`, and destroys its controller on `unmounted`.

MIT
