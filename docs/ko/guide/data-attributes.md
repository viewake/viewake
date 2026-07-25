# data 속성 사용법

Viewake의 공개 HTML API는 클래스 이름이 아니라 `data-viewake-*` 속성입니다. 기존 프로젝트의 클래스 작명 규칙과 충돌하지 않고, 마크업만 읽어도 애니메이션 설정을 알 수 있습니다.

## 가장 작은 문법

```html
<div data-viewake="fade-up">콘텐츠</div>
```

Viewake는 기본 선택자인 `[data-viewake]`로 이 요소를 찾습니다. `fade-up` 값은 `viewake/styles.css`에 정의된 CSS 프리셋을 선택합니다.

일반 JavaScript에서는 `init()`이 이 선택자로 문서 안의 요소를 찾습니다. React 컴포넌트·훅과 Vue 디렉티브는 자신이 연결된 요소를 컨트롤러에 직접 전달하므로 별도의 `init()`이 필요하지 않습니다. 어떤 방식을 사용해도 최종 DOM의 `data-*` 속성과 동작 규칙은 같습니다.

## 사용할 수 있는 속성

```html
<div
  data-viewake="slide-left"
  data-viewake-mode="replay"
  data-viewake-delay="300"
  data-viewake-duration="800"
  data-viewake-easing="ease-out"
>
  콘텐츠
</div>
```

| 속성 | 필수 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `data-viewake` | 예 | 없음 | 애니메이션 이름이며 관찰 대상 표시 |
| `data-viewake-mode` | 아니요 | 전역 `mode`, 기본 `once` | `once` 또는 `replay` |
| `data-viewake-delay` | 아니요 | 전역 `delay`, 기본 `0` | 0 이상의 밀리초 숫자 |
| `data-viewake-duration` | 아니요 | 전역 `duration`, 기본 `600` | 재생 시간(ms) |
| `data-viewake-easing` | 아니요 | 전역 `easing` | CSS easing 값 |
| `data-viewake-state` | 직접 사용 금지 | 자동 | 코어가 `pending`/`active`로 관리 |

## 요소 설정과 전역 설정의 우선순위

아래 `init()` 예시는 일반 JavaScript에서 코어 패키지를 직접 사용할 때의 설정입니다.

```js
init({
  mode: "once",
  delay: 100,
});
```

```html
<div data-viewake="fade-up">100ms, once</div>
<div data-viewake="fade-up" data-viewake-delay="500">500ms, once</div>
<div data-viewake="fade-up" data-viewake-mode="replay">100ms, replay</div>
```

요소의 `data-*` 값이 있으면 전역 옵션보다 우선합니다. 속성이 없거나 값이 유효하지 않으면 전역값을 사용합니다.

## delay는 자유로운 숫자입니다

```html
<div data-viewake="fade-up" data-viewake-delay="75">75ms</div>
<div data-viewake="fade-up" data-viewake-delay="1250">1.25초</div>
```

Viewake는 delay와 duration을 CSS 변수로 전달하므로 50ms 단위로 제한하지
않습니다. 음수나 `abc`처럼 올바르지 않은 시간 값은 전역값으로 대체합니다.

## 프로젝트 클래스와 함께 사용하기

```html
<article
  class="product-card featured"
  data-viewake="zoom-in"
  data-viewake-delay="150"
>
  ...
</article>
```

`product-card`와 `featured`는 프로젝트 디자인용이고, `data-viewake-*`는 Viewake 설정용입니다. 서로 역할이 분리됩니다.

## 실습 완료 조건

- `class`를 바꾸지 않고 `data-viewake` 값만 바꿔 애니메이션을 변경했다.
- 한 요소만 `replay`와 300ms delay로 재정의했다.
- `data-viewake-state`는 직접 쓰지 않아야 하는 이유를 설명할 수 있다.
- 요소 설정이 전역 설정보다 우선한다는 것을 확인했다.
