# 옵션

옵션은 `init()` 또는 `createViewake()`에 객체로 전달합니다.

이 페이지의 기본 예제는 일반 JavaScript core API 기준입니다. React와 Vue에서는
같은 core option을 adapter 문법으로 전달하며 `init()`을 따로 호출하지 않습니다.

```js
import { init } from "viewake";

init({
  threshold: 0.25,
  mode: "once",
  delay: 0,
  duration: 600,
  easing: "cubic-bezier(0.22, 1, 0.36, 1)",
  respectReducedMotion: true,
});
```

## 전체 옵션

| 옵션 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `selector` | `string` | `[data-viewake]` | 자동으로 찾을 요소 |
| `root` | `Element \| null` | `null` | 관찰 영역. `null`은 브라우저 화면 |
| `rootMargin` | `string` | `0px` | 관찰 영역의 가상 여백 |
| `threshold` | `number` | `0.15` | 0~1 사이의 노출 비율 |
| `mode` | `once \| replay` | `once` | 전역 재생 방식 |
| `delay` | `number` | `0` | 전역 지연 시간(ms) |
| `duration` | `number` | `600` | 전역 재생 시간(ms) |
| `easing` | `string` | `cubic-bezier(...)` | 전역 CSS easing |
| `observeMutations` | `boolean` | `true` | 나중에 추가된 요소도 자동 관찰 |
| `respectReducedMotion` | `boolean` | `true` | 모션 감소 설정 존중 |
| `onAwake` | `function` | 없음 | 요소가 활성화될 때 실행 |
| `onSleep` | `function` | 없음 | replay 요소가 다시 준비될 때 실행 |

## framework에서 option 전달

React 컴포넌트는 자주 쓰는 값과 controller option을 나눕니다.

```tsx
<Viewake
  animation="fade-up"
  mode="replay"
  delay={200}
  duration={900}
  easing="ease-out"
  options={{
    threshold: 0.25,
    rootMargin: "0px 0px -40px 0px",
  }}
>
  콘텐츠
</Viewake>
```

React 훅은 animation을 제외한 core option을 직접 받습니다.

```tsx
const ref = useViewake<HTMLElement>({
  mode: "replay",
  threshold: 0.25,
});

return <article ref={ref} data-viewake="fade-up">...</article>;
```

Vue의 전역 기본값은 plugin에, 요소별 값은 directive binding에 작성합니다.

```ts
app.use(createViewakePlugin({ threshold: 0.25, mode: "replay" }));
```

```vue
<article v-viewake="{ animation: 'fade-up', mode: 'once' }">...</article>
```

`onAwake`는 화면 아래에서 `pending`이었던 요소가 실제로 진입해 `active`로
전환될 때 호출됩니다. 초기화 시 이미 화면 안·위에 있어 곧바로 active가 된
요소와 모션 감소 환경에서는 진입 애니메이션이 없으므로 호출하지 않습니다.

## threshold와 rootMargin

```js
init({
  threshold: 0.3,
  rootMargin: "0px 0px -40px 0px",
});
```

`threshold`는 요소 자체가 얼마나 보여야 하는지를 뜻합니다. `rootMargin`은 관찰 영역의 경계를 이동합니다. 처음에는 `threshold`만 조절하고, 고정 헤더처럼 경계 보정이 필요할 때 `rootMargin`을 사용하세요.

## 요소별 덮어쓰기

```html
<div
  data-viewake="fade-up"
  data-viewake-mode="replay"
  data-viewake-delay="400"
  data-viewake-duration="900"
  data-viewake-easing="ease-out"
></div>
```

모드·delay·duration·easing은 요소의 `data-*` 값이 전역 옵션보다
우선합니다. `threshold`는 현재 컨트롤러 전체가 공유합니다.

## 이벤트 콜백

```js
init({
  onAwake({ element, mode, animation }) {
    console.log("등장", element, mode, animation);
  },
  onSleep({ element }) {
    console.log("다시 재생할 준비", element);
  },
});
```

## 실습 완료 조건

- `threshold`를 0.1과 0.5로 바꿔 실행 시점 차이를 확인했다.
- 전역 delay를 요소의 `data-viewake-delay`로 덮어썼다.
- `onAwake`에서 애니메이션 이름을 출력했다.
