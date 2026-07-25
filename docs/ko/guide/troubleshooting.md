# 문제 해결

문제가 생기면 먼저 “CSS가 없는가”, “관찰이 시작되지 않았는가”, “관찰은 됐지만 처음부터 active인가”를 구분하세요.

## 1. 내 integration이 맞는지 확인

| 사용 환경 | 관찰을 시작하는 코드 |
| --- | --- |
| 일반 JavaScript | `init()` |
| CDN | `Viewake.init()` |
| React 컴포넌트 | `<Viewake>`가 자동 시작 |
| React 훅 | `useViewake()`가 ref 요소를 자동 시작 |
| Vue | plugin 또는 `vViewake` directive가 자동 시작 |

React·Vue adapter를 사용하면서 같은 대상에 `init()`을 추가하지 마세요. observer가 중복될 수 있습니다.

## 2. 요소가 전혀 움직이지 않아요

### CSS 확인

```ts
import "viewake/styles.css";
```

일반 HTML의 CDN 방식이라면 `<link>`가 필요합니다. CSS가 없으면 상태가 바뀌어도 opacity와 transform transition이 없습니다.

### 대상 표시 확인

```html
<div data-viewake="fade-up">...</div>
```

- React `<Viewake animation="fade-up">`: 컴포넌트가 이 속성을 생성
- React 훅: ref 요소에 직접 `data-viewake="fade-up"` 작성
- Vue: `v-viewake="'fade-up'"`이 이 속성을 생성

### 상태 확인

개발자 도구에서 대상 요소를 선택합니다.

```text
data-viewake-state="pending" → 관찰 중이며 화면 아래에서 대기
data-viewake-state="active"  → 이미 활성화됨
상태 속성 없음              → integration 연결 또는 대상 지정 문제
```

상태가 없다면 환경별로 확인합니다.

- 일반 JavaScript: `init()`을 호출했는가?
- React 컴포넌트: 실제 DOM에 Viewake의 wrapper `div`가 있는가?
- React 훅: 반환된 `ref`를 요소에 연결했는가?
- Vue: plugin을 `app.use()`했거나 로컬 `vViewake`를 import했는가?

## 3. 처음부터 active예요

초기화할 때 이미 화면 안이나 화면 위에 있는 요소는 의도적으로 active가 됩니다. hydration 직후 보이던 콘텐츠를 숨겼다가 다시 보여 주는 깜빡임을 막기 위한 규칙입니다.

테스트 대상 위에 충분한 공간을 두어 요소가 화면 아래에서 시작하게 하세요.

## 4. React `<Viewake>`를 썼더니 레이아웃이 달라졌어요

`<Viewake>`는 `div`를 하나 추가합니다. Grid/Flex의 직접 자식이나 `ul > li` 구조를 유지해야 한다면 훅으로 실제 요소를 관찰하세요.

```tsx
const ref = useViewake<HTMLLIElement>();

return (
  <li ref={ref} data-viewake="fade-up">
    항목
  </li>
);
```

## 5. Vue `v-viewake="fade-up"`이 동작하지 않아요

Vue directive 값은 JavaScript 표현식입니다. 문자열 따옴표를 한 번 더 작성합니다.

```vue
<!-- 올바른 문자열 전달 -->
<article v-viewake="'fade-up'">...</article>
```

## 6. replay가 다시 실행되지 않아요

```html
<div data-viewake="fade-up" data-viewake-mode="replay">...</div>
```

처음 아래로 스크롤하여 요소를 통과한 뒤, 다시 위로 이동해 요소가 화면 **아래에 완전히** 놓여야 pending으로 돌아갑니다. 화면 아래쪽에 일부가 보이는 동안에는 재설정되지 않습니다.

위로 지나간 요소는 active를 유지합니다. Viewake는 mirror 퇴장 애니메이션을 제공하지 않습니다.

## 7. 사용자 지정 스크롤 영역에서 동작하지 않아요

실제로 `overflow: auto`로 스크롤되는 요소를 `root`로 전달합니다.

```ts
const root = document.querySelector(".scroll-panel");
const controller = createViewake({ root });

controller.observe(".panel-card");
```

React에서는 `<Viewake>`의 `options` prop에 root를 전달하고, Vue에서는 `createViewakePlugin({ root })`처럼 같은 core option을 adapter에 전달할 수 있습니다.

## 8. 동적으로 추가한 요소가 동작하지 않아요

일반 core의 기본값에서는 `MutationObserver`가 새 `[data-viewake]` 요소를 찾습니다.

```ts
const controller = init();

// observeMutations: false를 사용했다면 직접 갱신
controller.refresh();
```

React와 Vue는 framework가 mount한 요소를 adapter가 직접 관찰하므로 일반적인 조건부 렌더링에 core의 mutation 감시가 필요하지 않습니다.

## 9. 테스트 환경에 IntersectionObserver가 없어요

JSDOM에는 `IntersectionObserver`가 기본 제공되지 않을 수 있습니다. test setup에서 mock을 등록하거나 Viewake가 export하는 상태 머신 함수를 단위 테스트하세요.

## 최종 확인 순서

1. 내 환경에 맞는 integration 하나만 선택했는가?
2. CSS를 애플리케이션에서 한 번 불러왔는가?
3. 실제 애니메이션 대상에 `data-viewake`가 있는가?
4. adapter라면 component·ref·directive 연결이 완료됐는가?
5. `data-viewake-state`가 pending 또는 active인가?
6. 요소가 테스트 시작부터 화면 안에 있지 않은가?
7. 모션 감소 설정이 켜져 있지 않은가?
8. custom root가 실제 스크롤 요소와 같은가?

## 실습 완료 조건

- 상태 속성 없음, pending, active의 의미를 구분한다.
- 일반 JS의 `init()`과 React·Vue adapter의 자동 관찰 차이를 설명한다.
- React wrapper 문제를 훅으로 해결한다.
- replay가 재설정되는 정확한 위치 조건을 확인한다.
