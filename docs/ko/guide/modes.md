# once와 replay

모드는 “화면을 떠날 때 무조건 숨길지”가 아니라 “요소가 다시 화면 **아래로** 돌아왔을 때 다음 하강을 준비할지”를 결정합니다.

## once: 최초 한 번만

```html
<div data-viewake="fade-up" data-viewake-mode="once">...</div>
```

1. 요소가 처음에는 화면 아래에서 `pending`입니다.
2. 아래로 스크롤해 만나면 `active`가 됩니다.
3. 이후 위나 아래로 움직여도 계속 `active`입니다.
4. 다시 내려와도 애니메이션이 반복되지 않습니다.

`data-viewake-mode`를 생략해도 기본값은 `once`입니다.

## replay: 다시 아래에 놓이면 재생 준비

```html
<div data-viewake="fade-up" data-viewake-mode="replay">...</div>
```

1. 아래로 스크롤해 만나면 `active`가 됩니다.
2. 계속 내려 요소가 화면 **위로** 나가도 `active`를 유지합니다.
3. 위로 돌아가 요소가 화면 **아래로 완전히** 내려가면 `pending`으로 돌아갑니다.
4. 다시 아래로 스크롤하면 재생됩니다.

즉, 위로 지나간 요소가 갑자기 사라지는 “미러” 동작은 없습니다.

## 전역 기본값 지정

일반 JavaScript에서 코어 패키지를 직접 쓸 때는 `init()`에 기본 모드를 전달합니다.

```js
import { init } from "viewake";

init({ mode: "replay" });
```

이후 특정 요소만 한 번 실행할 수 있습니다.

```html
<div data-viewake="zoom-in" data-viewake-mode="once">...</div>
```

React에서는 `<Viewake mode="replay">` 또는 `useViewake({ mode: "replay" })`를 사용하고, Vue에서는 directive 객체나 `createViewakePlugin({ mode: "replay" })`에 전달합니다. React와 Vue에서는 `init()`을 추가로 호출하지 않습니다.

## 상태 흐름

```text
화면 아래(pending)
  └─ 아래로 스크롤해 진입 → active
       ├─ once: active 유지, 관찰 종료
       └─ replay: 화면 위에서는 active 유지
            └─ 다시 화면 아래로 완전히 이동 → pending
```

## 실습 완료 조건

- 메인 플레이그라운드에서 once와 replay를 각각 두 번 하강해 비교했다.
- replay 요소가 화면 위로 나갈 때 사라지지 않는 것을 확인했다.
- replay가 `pending`으로 돌아가는 정확한 조건을 설명할 수 있다.
