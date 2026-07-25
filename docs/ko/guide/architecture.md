# 내부 동작 원리

이 장은 Viewake를 직접 다시 구현할 수 있도록 브라우저 관점에서 실행 흐름을
설명합니다.

## 전체 흐름

```txt
init()
  ↓
[data-viewake] 요소 수집
  ↓
초기 위치 분류: above / inside / below
  ↓
below → data-viewake-state="pending"
above·inside → data-viewake-state="active"
  ↓
IntersectionObserver가 교차 변화 전달
  ↓
상태 머신이 pending / active 결정
  ↓
dataset.viewakeState 변경
  ↓
CSS transition 실행
```

## 1. 요소 수집

기본 선택자는 `[data-viewake]`입니다.

```ts
document.querySelectorAll("[data-viewake]");
```

`querySelectorAll()`은 정적인 `NodeList`를 반환합니다. Viewake는 이를 배열처럼
순회하여 각 요소를 추적합니다. 이후 동적으로 추가되는 요소는
`MutationObserver`가 별도로 찾습니다.

## 2. 초기 위치 분류

초기화할 때 요소가 어디에 있는지 먼저 판단합니다.

```ts
const rect = element.getBoundingClientRect();
const viewport = {
  top: 0,
  bottom: window.innerHeight,
};
```

| 위치 | 조건 | 초기 상태 |
| --- | --- | --- |
| `above` | `rect.bottom <= viewport.top` | `active` |
| `inside` | 위·아래 조건에 해당하지 않음 | `active` |
| `below` | `rect.top >= viewport.bottom` | `pending` |

현재 화면 안에 있는 콘텐츠를 pending으로 만들면 초기화 순간 콘텐츠가
깜빡입니다. 그래서 아래에 있어 아직 만나지 않은 요소만 숨깁니다.

## 3. IntersectionObserver 생성

```ts
const observer = new IntersectionObserver(handleEntries, {
  root: null,
  rootMargin: "0px",
  threshold: [0, 0.15],
});
```

- `root: null`: 브라우저 뷰포트를 기준으로 관찰
- `rootMargin`: 감지 영역을 확장하거나 축소
- `threshold`: 교차 비율이 0 또는 15% 경계를 지날 때 callback 실행

Viewake는 매 `scroll` 이벤트에서 좌표를 계산하지 않습니다. 브라우저가 교차
변화를 모아 callback으로 전달합니다.

## 4. 진입 처리

pending 요소가 아래에서 들어와 threshold를 만족하면 상태 머신에
`ENTER_FROM_BELOW` 이벤트를 보냅니다.

```ts
if (
  state === "sleeping" &&
  entry.isIntersecting &&
  entry.intersectionRatio >= threshold
) {
  transition("ENTER_FROM_BELOW");
}
```

상태 머신 결과가 `awake`이면 DOM 작업은 data 속성 변경 하나입니다.

```ts
element.dataset.viewakeState = "active";
```

## 5. replay 재설정

교차가 끝났다는 사실만으로는 요소가 화면 위로 나갔는지 아래로 나갔는지 알 수
없습니다. Viewake는 좌표를 함께 비교합니다.

```ts
const completelyBelow =
  entry.boundingClientRect.top >= entry.rootBounds.bottom;
```

replay 요소가 `awake`이고 화면 아래에 완전히 놓인 경우에만 다시 pending으로
전환합니다.

## 6. 정리

`destroy()`는 다음 작업을 수행합니다.

```txt
IntersectionObserver.disconnect()
MutationObserver.disconnect()
data-viewake-state와 delay CSS 변수 제거
추적 Map 비우기
```

SPA나 컴포넌트 환경에서 observer를 정리하지 않으면 사라진 화면의 요소를 계속
참조할 수 있습니다.

## 시간 복잡도 관점

초기화는 관찰할 요소 수를 `n`이라고 할 때 `O(n)`입니다. 이후에는 브라우저가
전달한 변경 항목만 처리합니다. 연속적인 scroll listener에서 전체 요소를 매번
순회하는 구조가 아닙니다.

## 실습 완료 조건

- 초기 위치가 below인 요소만 pending이 되는 이유를 설명할 수 있다.
- `isIntersecting`과 좌표 비교가 각각 무엇을 알려주는지 구분할 수 있다.
- `init()`부터 CSS transition까지의 흐름을 순서대로 그릴 수 있다.
