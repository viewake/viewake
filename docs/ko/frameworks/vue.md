# Vue 3

코어와 Vue 어댑터를 설치합니다.

```bash
npm install viewake viewake-vue
```

## 플러그인

앱에 디렉티브를 한 번 등록합니다.

```ts
import { createApp } from "vue";
import { ViewakePlugin } from "viewake-vue";
import "viewake/styles.css";

import App from "./App.vue";

createApp(App)
  .use(ViewakePlugin)
  .mount("#app");
```

`v-viewake`에는 애니메이션 이름 또는 설정 객체를 전달합니다.

```vue
<template>
  <article v-viewake="'fade-up'">
    한 번 등장
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
    다시 등장
  </article>
</template>
```

Vue 디렉티브는 DOM 요소의 생명주기에 기능을 붙이는 문법입니다. 이 어댑터는
`mounted`에서 요소 관찰을 시작하고 `unmounted`에서 컨트롤러를 정리합니다.

디렉티브는 실제 요소에 다음 `data-*` 속성을 붙입니다.

```html
<article data-viewake="zoom-in" data-viewake-mode="replay" data-viewake-delay="200" data-viewake-duration="900" data-viewake-easing="ease-out">
```

## 로컬 디렉티브

플러그인을 설치하지 않고 내보낸 디렉티브를 컴포넌트 안에서 사용할 수도 있습니다.

```vue
<script setup lang="ts">
import { vViewake } from "viewake-vue";
import "viewake/styles.css";
</script>

<template>
  <section v-viewake="'fade-up'">콘텐츠</section>
</template>
```

`<script setup>`에서는 `vViewake`라는 camelCase 변수가 템플릿의
`v-viewake` 이름으로 자동 노출됩니다.

## 플러그인 기본값

공통 설정이 적용된 플러그인을 만들 수 있습니다.

```ts
import { createViewakePlugin } from "viewake-vue";

app.use(
  createViewakePlugin({
    mode: "replay",
    threshold: 0.2,
  }),
);
```

애니메이션 시간과 거리는 Vue 옵션이 아니라 CSS에서 지정합니다.

```css
.feature-card {
  --viewake-duration: 500ms;
  --viewake-distance: 20px;
}
```

## 실습 완료 조건

- 문자열 값과 객체 값으로 `v-viewake`를 각각 사용했다.
- 전역 플러그인과 로컬 디렉티브 방식의 차이를 설명할 수 있다.
- 컴포넌트가 제거될 때 observer도 정리되는지 확인했다.
