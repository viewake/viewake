# Controller와 이벤트

## `init(options?)`

컨트롤러를 만들고 설정된 선택자를 즉시 관찰합니다.

```ts
const controller = init({
  mode: "replay",
});
```

## `createViewake(options?)`

아직 요소를 관찰하지 않는 컨트롤러를 만듭니다.

```ts
const controller = createViewake({
  threshold: 0.2,
});

controller.observe();
```

## `observe(targets?)`

CSS 선택자, 단일 요소, iterable 또는 array-like 컬렉션을 받습니다.

```ts
controller.observe();
controller.observe(".feature");
controller.observe(document.querySelector(".hero"));
controller.observe(document.querySelectorAll(".card"));
```

인자를 생략하면 기본 선택자 `[data-viewake]`를 사용합니다.

## `refresh()`

새로 선택자와 일치하는 요소를 찾고 DOM에서 제거된 요소를 추적 목록에서
정리합니다.

```ts
controller.refresh();
```

기본적으로 `MutationObserver`가 동적 추가를 감시하므로
`observeMutations: false`로 비활성화했을 때 주로 직접 호출합니다.

## `unobserve(targets)`

지정한 요소의 관찰을 중단하고 Viewake가 소유한 상태를 제거합니다.

```ts
controller.unobserve(".temporary-card");
```

## `destroy()`

intersection·mutation observer를 모두 끊고 추적하던 모든 요소를 정리합니다.

```ts
controller.destroy();
```

## DOM 이벤트

이벤트는 애니메이션 대상 요소에서 발생하며 상위 DOM으로 버블링됩니다.

```ts
document.addEventListener("viewake:awake", (event) => {
  const { sequence, timestamp, animation } = event.detail;
  console.log(sequence, timestamp, "awake", animation);
});

document.addEventListener("viewake:sleep", (event) => {
  const { sequence, timestamp, animation } = event.detail;
  console.log(sequence, timestamp, "sleep", animation);
});
```

`detail`에는 다음 정보가 담깁니다.

```ts
type ViewakeEventDetail = {
  element: Element;
  mode: "once" | "replay";
  animation: string;
  sequence: number;
  timestamp: number;
};
```

`viewake:sleep`은 `replay` 요소가 화면 아래에 완전히 놓인 경우에만 발생합니다.
이벤트 버블링을 이용하면 모든 카드에 리스너를 따로 달지 않고 문서나 목록
컨테이너 하나에서 이벤트 위임 방식으로 기록할 수 있습니다.

`animation`은 요소의 `data-viewake` 값입니다. 분석 로그나 애니메이션별
후속 동작을 만들 때 사용할 수 있습니다.

`sequence`는 한 controller에서 실제 상태가 바뀔 때마다 1씩 증가하므로
로그 순서를 판단하는 기준입니다. `timestamp`는 전이가 발생한 Unix
millisecond 시각입니다. 개발자 도구에서 DOM 객체를 나중에 펼치면 변경된
현재 상태가 보일 수 있으므로, 위 예시처럼 원시값을 즉시 출력하는 편이
정확합니다.

## 실습 완료 조건

- 선택자, 단일 요소, `NodeList`를 각각 `observe()`에 전달했다.
- 상위 컨테이너 하나에서 `viewake:awake` 이벤트를 받았다.
- `unobserve()`와 `destroy()`의 범위 차이를 설명할 수 있다.
