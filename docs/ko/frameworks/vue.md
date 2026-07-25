# Vue 3

Vue에서는 `init()`을 직접 호출하지 않습니다. `viewake-vue`의 디렉티브가 실제 DOM 요소의 mount·update·unmount 생명주기에 맞춰 관찰과 정리를 수행합니다.

## 먼저 어떤 방식을 쓸지 선택하세요

| 상황 | 추천 |
| --- | --- |
| 여러 컴포넌트에서 `v-viewake`를 사용 | 전역 플러그인 |
| 한 컴포넌트에서만 시험하거나 사용 | 로컬 `vViewake` |
| Vue가 관리하지 않는 일반 HTML을 한꺼번에 관찰 | 코어의 `init()` |

대부분의 Vue 앱은 전역 플러그인을 한 번 등록하는 방식이 가장 단순합니다.

## 1. 설치

```bash
npm install viewake viewake-vue
```

## 2. 권장 방식: 플러그인을 한 번 등록

애플리케이션 entry에서 CSS와 플러그인을 연결합니다.

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

이후 모든 컴포넌트에서 import 없이 `v-viewake`를 사용할 수 있습니다.

```vue
<template>
  <article v-viewake="'fade-up'">
    한 번 등장
  </article>
</template>
```

이 코드만으로 관찰이 시작됩니다. 다음 코드는 추가하지 않습니다.

```ts
// Vue adapter를 쓸 때는 필요하지 않습니다.
// import { init } from "viewake";
// init();
```

`v-viewake="'fade-up'"`에서 바깥 큰따옴표는 HTML 속성이고, 안쪽 작은따옴표는 Vue 표현식의 문자열입니다. 작은따옴표를 빼면 Vue는 `fade-up`이라는 변수를 찾습니다.

## 3. 옵션이 필요하면 객체 전달

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
    다시 등장
  </article>
</template>
```

디렉티브는 wrapper를 만들지 않고 `article` 자체에 속성을 붙입니다.

```html
<article
  data-viewake="zoom-in"
  data-viewake-mode="replay"
  data-viewake-delay="200"
  data-viewake-duration="900"
  data-viewake-easing="ease-out"
>
  다시 등장
</article>
```

| 전달 값 | 의미 |
| --- | --- |
| `animation` | CSS 프리셋 또는 사용자 애니메이션 이름 |
| `mode` | `once` 또는 `replay` |
| `delay` | 시작 전 대기 시간(ms) |
| `duration` | 움직이는 시간(ms) |
| `easing` | CSS timing function |

반응형 값이 바뀌면 디렉티브의 `updated` 단계가 이전 controller를 정리하고 새 설정으로 다시 관찰합니다.

```vue
<script setup lang="ts">
import { ref } from "vue";

const replay = ref(false);
</script>

<template>
  <article
    v-viewake="{
      animation: 'fade-up',
      mode: replay ? 'replay' : 'once'
    }"
  >
    모드 변경
  </article>
</template>
```

## 4. 공통 기본값이 필요할 때

앱 전체에서 같은 threshold나 mode로 시작하려면 설정된 플러그인을 만듭니다.

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

이제 mode를 생략한 요소는 플러그인의 `replay`를 사용합니다.

```vue
<article v-viewake="'fade-up'">
  플러그인 기본값 replay 사용
</article>
```

요소에서 명시한 값은 플러그인 기본값보다 우선합니다.

```vue
<article
  v-viewake="{
    animation: 'fade-up',
    mode: 'once',
    duration: 400
  }"
>
  이 요소만 once와 400ms 사용
</article>
```

## 5. 한 컴포넌트에서만 쓰는 로컬 디렉티브

앱 전체에 플러그인을 등록하고 싶지 않다면 `vViewake`를 import합니다.

```vue
<script setup lang="ts">
import { vViewake } from "viewake-vue";
</script>

<template>
  <section v-viewake="'slide-up'">
    이 컴포넌트에서만 사용
  </section>
</template>
```

`<script setup>`에서 `vViewake`라는 camelCase 변수는 template의 `v-viewake` directive로 자동 노출됩니다. CSS는 이 컴포넌트마다 가져오지 말고 `main.ts`에서 한 번 가져오는 것을 권장합니다.

## 6. 내부 생명주기

```text
Vue mounted
→ data-viewake-* 속성 적용
→ controller 생성
→ 실제 요소 하나 observe
→ binding 값 변경 시 이전 controller 정리 후 재연결
→ Vue unmounted
→ destroy()와 data 속성 정리
```

Vue 디렉티브는 실제 요소에 기능을 붙이므로 React `<Viewake>`와 달리 추가 wrapper를 만들지 않습니다.

## 자주 묻는 질문

### Vue에서도 `init()`이 필요한가요?

아니요. 플러그인이나 로컬 디렉티브가 요소별 관찰을 시작합니다.

### 플러그인과 로컬 디렉티브를 함께 써야 하나요?

아니요. 앱 전체에서 쓸지 한 컴포넌트에서만 쓸지에 따라 하나를 선택합니다.

### `v-viewake="fade-up"`이 왜 오류가 나나요?

Vue가 `fade-up`을 문자열이 아닌 표현식으로 해석하기 때문입니다. 문자열은 `v-viewake="'fade-up'"`처럼 전달하세요.

## 실습 완료 조건

- `main.ts`에서 CSS와 플러그인을 한 번만 등록했다.
- `v-viewake="'fade-up'"`만으로 요소를 등장시키고 `init()`이 필요 없다고 설명할 수 있다.
- 객체 값으로 replay·delay·duration을 설정했다.
- 플러그인 기본값과 요소별 덮어쓰기의 우선순위를 확인했다.
- 전역 플러그인과 로컬 디렉티브 중 하나만 선택해야 하는 이유를 설명할 수 있다.
