# 접근성과 SSR

스크롤 애니메이션은 장식 기능입니다. 콘텐츠 접근성을 해치면 안 됩니다.

## JavaScript가 없어도 콘텐츠 표시

Viewake의 기본 `[data-viewake]` 규칙은 콘텐츠를 숨기지 않습니다. JavaScript가
실행되어 화면 아래 요소를 `data-viewake-state="pending"`으로 바꾼 뒤에만 숨겨집니다.

```css
[data-viewake] {
  opacity: 1;
}

[data-viewake][data-viewake-state="pending"] {
  opacity: 0;
}
```

이 순서 덕분에 네트워크 실패나 스크립트 오류가 있어도 본문은 읽을 수 있습니다.

## 모션 감소 설정

사용자가 운영체제에서 모션 감소를 요청했다면 transition을 실행하지 않습니다.

```css
@media (prefers-reduced-motion: reduce) {
  [data-viewake] {
    opacity: 1 !important;
    transform: none !important;
    filter: none !important;
    transition: none !important;
  }
}
```

코어도 `matchMedia("(prefers-reduced-motion: reduce)")`를 확인하여 observer를
만들지 않고 요소를 바로 active로 처리합니다.

## SSR에서 안전한 이유

모듈 최상위에서 `window`, `document`, `Element`에 접근하면 Node.js 렌더링에서
오류가 발생합니다. Viewake는 브라우저 API 접근을 함수 실행 시점까지 미룹니다.

```ts
// import 자체는 서버에서도 안전
import { createViewake } from "viewake";
```

React 어댑터는 `useEffect` 안에서 컨트롤러를 생성합니다. effect는 서버에서
실행되지 않습니다.

## 의미 구조는 그대로 유지

Viewake는 wrapper를 요구하지 않습니다. `article`, `section`, `li`처럼 콘텐츠에
맞는 의미 요소에 `data-viewake`를 직접 붙일 수 있습니다.

```html
<article data-viewake="fade-up">
  <h2>제목</h2>
  <p>본문</p>
</article>
```

애니메이션을 위해 `aria-hidden="true"`를 추가하면 스크린 리더에서도 콘텐츠가
사라지므로 사용하지 마세요.

## 포커스 가능한 요소

화면 아래의 버튼이나 링크가 pending 상태여도 DOM에는 존재합니다. 사용자가
키보드 Tab으로 아직 보이지 않는 요소에 도달하는 긴 페이지라면 애니메이션
범위를 짧은 섹션으로 제한하거나 `once`를 사용하세요.

## 실습 완료 조건

- JavaScript를 끈 상태에서도 콘텐츠를 읽을 수 있다.
- 운영체제 모션 감소 설정에서 transition이 실행되지 않는다.
- 서버 렌더링 중 Viewake import가 오류를 내지 않는다.
