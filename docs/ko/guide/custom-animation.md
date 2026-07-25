# 사용자 애니메이션 만들기

새 애니메이션은 JavaScript를 수정하지 않고 CSS 선택자 하나로 추가합니다. 코어가 `data-viewake-state`만 바꾸기 때문입니다.

## 1. 이름 정하기

```html
<article data-viewake="blur-up">사용자 효과</article>
```

## 2. pending 모습 정의하기

```css
[data-viewake="blur-up"][data-viewake-state="pending"] {
  filter: blur(14px);
  transform: translate3d(0, 28px, 0);
}
```

기본 `[data-viewake]` 규칙이 opacity와 transition을 제공하고, active 상태에서는 `opacity: 1`, `transform: none`, `filter: none`으로 돌아갑니다.

## 3. 요소별로 속도 조절하기

```css
.hero-card {
  --viewake-duration: 900ms;
  --viewake-distance: 40px;
}
```

```html
<article
  class="hero-card"
  data-viewake="blur-up"
  data-viewake-delay="150"
>
  ...
</article>
```

## 주의할 점

- 레이아웃을 다시 계산하는 `top`, `left`, `width`보다 `transform`과 `opacity`를 우선합니다.
- active 선택자를 별도로 만들기보다 `none`으로 돌아오는 공통 규칙을 재사용하세요.
- 콘텐츠를 읽기 어렵게 만드는 긴 blur·회전은 피하세요.
- 모션 감소 환경은 기본 CSS가 자동으로 움직임을 제거합니다.

## 실습 완료 조건

- `blur-up`이라는 새 이름을 만들고 JavaScript 변경 없이 동작시켰다.
- 프로젝트 클래스와 `data-viewake`의 역할을 분리했다.
- duration과 delay가 서로 다른 속성임을 설명할 수 있다.
