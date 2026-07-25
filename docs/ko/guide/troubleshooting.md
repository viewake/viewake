# 문제 해결

## 요소가 움직이지 않아요

필수 data 속성과 CSS import를 확인하세요.

```html
<div data-viewake="fade-up">...</div>
```

```ts
import "viewake/styles.css";
```

개발자 도구에서 요소의 `data-viewake-state`가 `pending` 또는 `active`인지
확인합니다. 이 속성이 없다면 `init()`이 실행되지 않았거나 선택자가
다릅니다.

## 처음부터 active예요

초기화 시 이미 화면 안 또는 화면 위에 있는 요소는 의도적으로 active가 됩니다.
초기 화면을 숨겼다가 다시 보여 주는 깜빡임을 방지하기 위한 동작입니다.

테스트할 때 요소 위에 충분한 여백을 두어 화면 아래에서 시작하게 하세요.

## replay가 다시 실행되지 않아요

`data-viewake-mode="replay"`가 있는지 확인합니다.

```html
<div data-viewake="fade-up" data-viewake-mode="replay">...</div>
```

그리고 요소가 화면 아래에 **완전히** 놓일 만큼 위로 돌아가야 합니다. 화면
아래쪽에 요소의 일부가 보이는 상태에서는 재설정되지 않습니다.

## 화면 위로 지나가자마자 숨기고 싶어요

Viewake는 의도적으로 이 동작을 지원하지 않습니다. 위로 지나간 콘텐츠를 숨기면
사용자가 위로 스크롤할 때 읽던 내용이 불안정해질 수 있기 때문입니다.

퇴장 애니메이션이 필요한 인터랙션이라면 Viewake의 범위보다 양방향 timeline
애니메이션 도구가 더 적합합니다.

## 사용자 지정 스크롤 영역에서 동작하지 않아요

실제로 스크롤되는 요소를 `root`로 전달해야 합니다.

```ts
const root = document.querySelector(".scroll-panel");

createViewake({ root }).observe();
```

`overflow: auto`가 다른 부모에 설정되어 있다면 좌표 기준과 실제 스크롤 영역이
달라집니다.

## 동적으로 추가한 요소가 동작하지 않아요

기본값에서는 `MutationObserver`가 `[data-viewake]` 요소의 추가를 감지합니다.
`observeMutations: false`를 사용했다면 추가 후 직접 호출하세요.

```ts
controller.observe(newElement);
// 또는
controller.refresh();
```

## 테스트 환경에 IntersectionObserver가 없어요

JSDOM 같은 DOM 테스트 환경에는 `IntersectionObserver`가 기본 제공되지 않을 수
있습니다. 테스트 setup에서 mock을 등록하거나 상태 머신 함수를 단위 테스트하세요.

## 확인 순서

1. CSS가 import되었는가?
2. 대상에 `data-viewake`가 있는가?
3. `init()` 또는 `observe()`가 실행되었는가?
4. `data-viewake-state`가 `active` 또는 `pending`인가?
5. 사용자 모션 감소 설정이 켜져 있지 않은가?
6. custom root가 실제 스크롤 요소와 같은가?

## 실습 완료 조건

- 개발자 도구에서 `data-viewake-state`와 세 timing CSS 변수를 확인했다.
- replay가 재설정되려면 요소가 화면 아래에 완전히 있어야 한다고 설명할 수 있다.
- JavaScript 미실행, CSS 미로딩, 잘못된 root를 각각 구분해 점검했다.
