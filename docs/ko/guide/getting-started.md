# 시작하기

이 페이지는 Viewake를 처음 접한 사람이 복사한 예제를 실행하고, 각 코드가 왜 필요한지 설명할 수 있게 만드는 것을 목표로 합니다.

## 1. 설치 방법을 하나만 선택하세요

Vite, React, Vue처럼 `package.json`이 있는 프로젝트라면 npm을 사용합니다.

```bash
npm install viewake
```

빌드 도구가 없는 일반 HTML 파일이라면 [CDN과 일반 HTML](/ko/guide/cdn)을 사용하세요. npm 코드와 CDN 코드를 한 페이지에 섞을 필요는 없습니다.

## 2. CSS와 JavaScript를 불러오세요

```js
import "viewake/styles.css";
import { init } from "viewake";

init();
```

- 첫 줄은 등장 전 모습과 움직임을 정의한 CSS를 불러옵니다.
- 두 번째 줄은 스크롤 위치를 관찰하는 `init` 함수를 가져옵니다.
- `init()`은 문서에서 `[data-viewake]` 요소를 찾아 관찰을 시작합니다.

## 3. 움직일 요소를 표시하세요

```html
<article data-viewake="fade-up">
  아래에서 부드럽게 등장합니다.
</article>
```

`data-viewake`는 “이 요소를 Viewake가 관리한다”는 표시이자 애니메이션 이름입니다. `fade-up`은 투명한 상태로 아래에 있다가 원래 자리로 올라온다는 뜻입니다.

## 4. 모드와 delay를 추가하세요

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
| `data-viewake-mode` | `once` 또는 `replay` | 한 번만 실행할지, 다시 실행할지 |
| `data-viewake-delay` | `200` | 감지 후 기다릴 시간(ms) |
| `data-viewake-duration` | `900` | 애니메이션이 재생되는 시간(ms) |
| `data-viewake-easing` | `ease-out` | 움직임의 가속·감속 곡선 |

`delay="200"`은 시작 전 0.2초를 기다리고, `duration="900"`은 움직임이
0.9초 동안 이어진다는 뜻입니다. 숫자 뒤에 `ms`를 쓰지 않습니다.

## 5. 실행 시점을 바꾸고 싶다면

```js
init({
  threshold: 0.3,
});
```

`threshold: 0.3`은 요소 면적의 약 30%가 관찰 영역에 들어왔을 때 실행한다는 뜻입니다. 허용 범위는 `0`부터 `1`까지이며 기본값은 `0.15`입니다. 이 값은 전체 요소에 적용하는 JavaScript 옵션이고 `data-viewake-delay`와는 역할이 다릅니다.

## 브라우저에서 일어나는 일

Viewake는 내부적으로 아래 상태만 바꿉니다.

```html
<!-- 아직 화면 아래에 있음 -->
<article data-viewake="fade-up" data-viewake-state="pending">

<!-- 실행됨 -->
<article data-viewake="fade-up" data-viewake-state="active">
```

`data-viewake-state`는 라이브러리가 관리하므로 직접 작성하지 마세요. 애니메이션의 시각 효과는 CSS가, 스크롤 판단은 JavaScript가 담당합니다.

## 실습 완료 조건

아래를 모두 확인했다면 다음 문서로 넘어가도 됩니다.

- 새 요소에 `data-viewake="fade-up"`을 붙여 등장시켰다.
- `data-viewake-delay="500"`으로 0.5초 지연을 확인했다.
- `once`는 두 번째 하강에서 실행되지 않고 `replay`는 다시 실행되는 것을 확인했다.
- 개발자 도구에서 상태가 `pending`에서 `active`로 바뀌는 것을 확인했다.
- `threshold`와 `delay`의 차이를 말로 설명할 수 있다.
- delay와 duration의 차이를 말로 설명할 수 있다.

다음은 [data 속성 사용법](/ko/guide/data-attributes)에서 속성의 우선순위와 잘못된 값의 처리 방식을 배웁니다.
