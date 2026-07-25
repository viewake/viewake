# 시작하기

Viewake를 시작할 때 가장 먼저 할 일은 내 프로젝트에 맞는 연결 방식을 **하나만** 고르는 것입니다. 모든 환경에서 `init()`을 호출하는 것이 아닙니다.

## 1. 내 환경 선택

| 프로젝트 | 설치 | 관찰 시작 방법 | `init()` |
| --- | --- | --- | --- |
| 일반 JavaScript + Vite/Webpack | `viewake` | `init()` | 필요 |
| React·Next.js | `viewake` + `viewake-react` | `<Viewake>` 또는 `useViewake()` | 불필요 |
| Vue 3 | `viewake` + `viewake-vue` | `v-viewake` | 불필요 |
| 빌드 도구 없는 HTML | CDN CSS + script | `Viewake.init()` | 필요 |

::: tip 한 가지만 선택하세요
React 컴포넌트에 `<Viewake>`를 사용하면서 같은 요소를 core `init()`으로 다시 찾지 마세요. Vue directive도 마찬가지입니다. adapter가 생명주기에 맞춰 관찰을 시작합니다.
:::

## 2. 가장 빠른 환경별 예제

### 일반 JavaScript 프로젝트

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
  아래에서 부드럽게 등장합니다.
</article>
```

`init()`은 문서에서 `[data-viewake]` 요소를 모두 찾아 관찰합니다.

### React 또는 Next.js

```bash
npm install viewake viewake-react
```

```tsx
import { Viewake } from "viewake-react";
import "viewake/styles.css";

export function Feature() {
  return (
    <Viewake animation="fade-up">
      기능 설명
    </Viewake>
  );
}
```

여기서는 `init()`을 호출하지 않습니다. 컴포넌트가 내부에서 자기 `div`를 관찰합니다. wrapper 없이 기존 요소를 관찰해야 할 때만 훅을 사용합니다. 자세한 선택 기준은 [React와 Next.js](/ko/frameworks/react-next)를 읽으세요.

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
  기능 설명
</article>
```

Vue에서도 `init()`을 호출하지 않습니다. directive가 실제 `article`을 관찰합니다. 자세한 사용법은 [Vue 3](/ko/frameworks/vue)를 읽으세요.

### 일반 HTML과 CDN

`<link>`, `<script>`, `Viewake.init()`을 사용합니다. 전체 HTML은 [CDN과 일반 HTML](/ko/guide/cdn)에 있습니다.

## 3. 공통 설정은 `data-*`로 읽기

어떤 integration을 사용해도 최종 DOM에는 같은 `data-viewake-*` 계약이 남습니다.

```html
<article
  data-viewake="zoom-in"
  data-viewake-mode="replay"
  data-viewake-delay="200"
  data-viewake-duration="900"
  data-viewake-easing="ease-out"
>
  200ms 뒤에 확대되며 등장합니다.
</article>
```

| 속성 | 값 | 의미 |
| --- | --- | --- |
| `data-viewake` | `zoom-in` | 사용할 CSS 애니메이션 |
| `data-viewake-mode` | `once` 또는 `replay` | 한 번만 실행할지 다시 준비할지 |
| `data-viewake-delay` | `200` | 감지 후 기다릴 시간(ms) |
| `data-viewake-duration` | `900` | 움직이는 시간(ms) |
| `data-viewake-easing` | `ease-out` | 가속·감속 곡선 |

React 컴포넌트와 Vue directive는 prop·binding 값을 이 속성으로 바꿔 줍니다. 일반 JavaScript와 CDN에서는 직접 작성합니다.

## 4. once와 replay

- `once`: 처음 등장한 뒤 계속 보이며 다시 실행하지 않음
- `replay`: 위로 지나간 콘텐츠는 계속 보이고, 요소가 다시 화면 아래에 완전히 놓인 뒤 다음 하강을 준비

`replay`는 화면을 떠날 때 무조건 숨기는 mirror 기능이 아닙니다. 정확한 스크롤 흐름은 [once와 replay](/ko/guide/modes)에서 확인하세요.

## 5. threshold와 delay를 구분하세요

```js
// 일반 JavaScript의 전역 설정
init({
  threshold: 0.3,
});
```

- `threshold: 0.3`: 요소가 약 30% 들어온 시점에 감지
- `delay: 200`: 감지된 뒤 200ms 기다렸다가 CSS transition 시작
- `duration: 900`: transition 자체가 900ms 동안 진행

React에서는 `<Viewake>`의 `options` prop에 `threshold: 0.3`을 전달하고, Vue에서는 설정된 plugin option에 threshold를 전달합니다.

## 6. 개발자 도구에서 성공 확인

Viewake가 실행되면 화면 아래 요소의 상태가 바뀝니다.

```html
<!-- 아직 화면 아래에서 대기 -->
<article data-viewake="fade-up" data-viewake-state="pending">

<!-- 화면에 들어와 활성화 -->
<article data-viewake="fade-up" data-viewake-state="active">
```

`data-viewake-state`는 라이브러리가 관리하므로 직접 작성하지 마세요.

## 실습 완료 조건

- 내 프로젝트가 일반 JS, React, Vue, CDN 중 어디인지 선택했다.
- 선택한 integration 하나만 사용해 요소를 등장시켰다.
- React/Vue adapter에서는 `init()`이 필요 없다고 설명할 수 있다.
- `once`와 `replay`를 두 번 하강하며 비교했다.
- `threshold`, `delay`, `duration`의 차이를 설명할 수 있다.
- 개발자 도구에서 `pending → active` 변화를 확인했다.

다음은 [data 속성 사용법](/ko/guide/data-attributes)에서 모든 integration이 공유하는 DOM 계약을 배웁니다.
