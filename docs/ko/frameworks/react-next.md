# React와 Next.js

React에서는 `init()`을 직접 호출하지 않습니다. `viewake-react`의 컴포넌트나 훅이 필요한 요소만 관찰하고, 컴포넌트가 사라질 때 observer도 정리합니다.

## 먼저 어떤 방식을 쓸지 선택하세요

| 상황 | 추천 |
| --- | --- |
| 추가 `div`가 생겨도 괜찮고 빠르게 적용하고 싶음 | `<Viewake>` 컴포넌트 |
| `article`, `li`, Grid/Flex 자식 등 기존 요소 자체를 유지해야 함 | `useViewake()` 훅 |
| React 바깥의 일반 HTML 요소를 한꺼번에 찾고 싶음 | 코어의 `init()` |

대부분은 `<Viewake>`로 시작하세요. 훅은 wrapper가 HTML 구조나 레이아웃을 방해할 때만 필요합니다. 같은 요소에 컴포넌트·훅·`init()`을 함께 사용하면 observer가 중복될 수 있으므로 한 방식만 선택합니다.

## 1. 설치

```bash
npm install viewake viewake-react
```

- `viewake`: 스크롤 판단과 CSS 프리셋을 가진 코어
- `viewake-react`: React 생명주기에 코어를 연결하는 컴포넌트와 훅

## 2. CSS를 한 번만 가져오기

Vite React에서는 애플리케이션 entry에서 가져옵니다.

```tsx
// src/main.tsx
import "viewake/styles.css";
```

Next.js App Router에서는 루트 레이아웃에서 가져옵니다.

```tsx
// app/layout.tsx
import "viewake/styles.css";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
```

CSS는 등장 전 모습과 transition을 정의합니다. 여러 컴포넌트에서 반복해서 import할 필요가 없습니다.

## 3. 가장 쉬운 방법: `<Viewake>`

```tsx
import { Viewake } from "viewake-react";

export function FeatureCard() {
  return (
    <Viewake
      animation="fade-up"
      mode="once"
      className="feature-card"
    >
      <h2>빠른 검색</h2>
      <p>검색 결과를 한눈에 확인합니다.</p>
    </Viewake>
  );
}
```

이 코드만으로 관찰이 시작됩니다. 다음 코드는 추가하지 않습니다.

```tsx
// React adapter를 쓸 때는 필요하지 않습니다.
// import { init } from "viewake";
// init();
```

`Viewake`는 실제 DOM에 `div` 하나를 렌더링합니다.

```html
<div
  class="feature-card"
  data-viewake="fade-up"
  data-viewake-mode="once"
>
  <h2>빠른 검색</h2>
  <p>검색 결과를 한눈에 확인합니다.</p>
</div>
```

이 `div`가 관찰 대상이자 애니메이션 대상입니다. `className`과 일반 `div` 속성도 그대로 전달할 수 있습니다.

```tsx
<Viewake
  animation="zoom-in"
  mode="replay"
  delay={200}
  duration={900}
  easing="ease-out"
  id="search-feature"
  className="feature-card featured"
>
  콘텐츠
</Viewake>
```

### `options`는 언제 쓰나요?

자주 쓰는 `mode`, `delay`, `duration`, `easing`은 컴포넌트 prop으로 바로 전달합니다. 감지 영역과 실행 비율처럼 컨트롤러 설정이 필요할 때만 `options`를 사용합니다.

```tsx
<Viewake
  animation="fade-up"
  options={{
    threshold: 0.25,
    rootMargin: "0px 0px -40px 0px",
  }}
>
  콘텐츠
</Viewake>
```

## 4. wrapper가 문제일 때만 `useViewake()`

훅은 새 DOM을 만들지 않습니다. 내가 작성한 요소에 `ref`를 연결하여 그 요소 자체를 관찰합니다.

```tsx
import { useViewake } from "viewake-react";

export function FeatureArticle() {
  const ref = useViewake<HTMLElement>({
    mode: "once",
    threshold: 0.2,
  });

  return (
    <article ref={ref} data-viewake="fade-up">
      <h2>의미 있는 article 유지</h2>
      <p>추가 div 없이 article 자체가 움직입니다.</p>
    </article>
  );
}
```

실제 DOM도 작성한 그대로입니다.

```html
<article data-viewake="fade-up">
  ...
</article>
```

### 훅이 실제로 필요한 예: 목록

`ul`의 직접 자식은 `li`여야 합니다. 다음처럼 `Viewake`의 `div`로 `li`를 감싸면 올바른 목록 구조가 아닙니다.

```tsx
// 피하세요: ul 바로 아래에 div가 생깁니다.
<ul>
  <Viewake animation="fade-up">
    <li>첫 번째 기능</li>
  </Viewake>
</ul>
```

이때 훅으로 `li` 자체를 관찰합니다.

```tsx
import { useViewake } from "viewake-react";

export function FeatureItem() {
  const ref = useViewake<HTMLLIElement>({
    mode: "once",
  });

  return (
    <li ref={ref} data-viewake="fade-up">
      첫 번째 기능
    </li>
  );
}
```

`useViewake<HTMLLIElement>`의 제네릭은 ref가 연결될 DOM 타입을 TypeScript에 알려줍니다.

| JSX 요소 | 권장 타입 |
| --- | --- |
| `<article>` | `HTMLElement` |
| `<div>` | `HTMLDivElement` |
| `<li>` | `HTMLLIElement` |
| `<section>` | `HTMLElement` |

훅에서는 `animation`을 option에 넣지 않습니다. 애니메이션 이름은 실제 DOM의 `data-viewake`에 작성합니다.

```tsx
const ref = useViewake<HTMLDivElement>({ mode: "replay" });

return (
  <div ref={ref} data-viewake="slide-left">
    콘텐츠
  </div>
);
```

## 5. Next.js App Router

`viewake-react` entry에는 이미 `"use client"`가 있습니다. 따라서 아래 Server Component에 `"use client"`를 추가할 필요가 없습니다.

```tsx
// app/page.tsx — Server Component
import { Viewake } from "viewake-react";

export default function Page() {
  return (
    <main>
      <Viewake animation="fade-up">
        <h2>서버 페이지 안의 애니메이션 영역</h2>
      </Viewake>
    </main>
  );
}
```

이 말은 페이지 전체가 client rendering으로 바뀐다는 뜻이 아닙니다. `Viewake` 어댑터부터 observer가 필요한 작은 Client Component 경계가 시작된다는 뜻입니다.

훅을 직접 호출하는 내 컴포넌트는 Client Component여야 합니다.

```tsx
"use client";

import { useViewake } from "viewake-react";

export function FeatureArticle() {
  const ref = useViewake<HTMLElement>();

  return (
    <article ref={ref} data-viewake="fade-up">
      콘텐츠
    </article>
  );
}
```

## 6. 내부 생명주기

컴포넌트와 훅은 둘 다 내부에서 같은 순서로 동작합니다.

```text
React mount
→ ref로 실제 DOM 확인
→ createViewake()로 controller 생성
→ 해당 DOM 하나를 observe()
→ React unmount
→ destroy()로 observer와 상태 정리
```

이 작업은 `useEffect` 안에서 실행되므로 서버 렌더링 중에는 `window`나 `document`에 접근하지 않습니다. Strict Mode가 개발 중 effect를 연결·정리·재연결해도 cleanup이 이전 observer를 제거합니다.

## 7. CSS Module과 함께 사용

```tsx
import styles from "./feature-card.module.css";

<Viewake
  animation="fade-up"
  className={styles.card}
  options={{ threshold: 0.25 }}
>
  콘텐츠
</Viewake>
```

```css
.card {
  --viewake-duration: 720ms;
  --viewake-distance: 32px;
}
```

- `className`: 프로젝트 디자인
- `animation`, `mode`, `delay`: Viewake 설정
- CSS 변수: 여러 애니메이션 시각 값을 한 스타일로 묶을 때 사용

## 자주 묻는 질문

### React에서도 `init()`을 호출해야 하나요?

아니요. `<Viewake>`와 `useViewake()`가 내부에서 관찰을 시작합니다.

### 컴포넌트와 훅 중 무엇을 먼저 써야 하나요?

추가 `div`가 괜찮다면 컴포넌트를 사용하세요. wrapper 때문에 시맨틱 HTML이나 Grid/Flex 배치가 깨질 때만 훅을 사용합니다.

### 한 페이지에서 둘을 함께 쓸 수 있나요?

서로 다른 요소에는 사용할 수 있습니다. 같은 요소를 두 방식으로 동시에 관찰하지 마세요.

## 실습 완료 조건

- `<Viewake>`만으로 요소를 등장시키고 `init()`이 필요 없다고 설명할 수 있다.
- `<Viewake>`가 `div`를 추가한다는 것을 개발자 도구에서 확인했다.
- wrapper가 문제가 되는 `li`에는 `useViewake<HTMLLIElement>()`를 사용했다.
- Next.js 루트 레이아웃에서 CSS를 한 번만 import했다.
- 훅을 호출하는 내 컴포넌트에만 `"use client"`가 필요한 이유를 설명할 수 있다.
