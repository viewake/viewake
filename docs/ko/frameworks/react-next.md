# React와 Next.js

`viewake-react`는 React 컴포넌트와 훅을 제공합니다. 코어 패키지와 함께
설치합니다.

```bash
npm install viewake viewake-react
```

애플리케이션에서 프리셋 CSS는 한 번만 가져옵니다.

```tsx
import "viewake/styles.css";
```

## React 컴포넌트

```tsx
import { Viewake } from "viewake-react";

export function FeatureCard() {
  return (
    <Viewake animation="fade-up" mode="replay" delay={200} duration={900}>
      <article>기능 설명</article>
    </Viewake>
  );
}
```

`Viewake`는 `div`를 렌더링하고 애니메이션·모드·delay를 `data-*` 속성으로
기록한 뒤 `ref`를 연결합니다. 자식 콘텐츠는 그대로 유지됩니다.

실제로 생성되는 마크업은 다음 형태입니다.

```html
<div data-viewake="fade-up" data-viewake-mode="replay" data-viewake-delay="200" data-viewake-duration="900">
```

## React 훅

기존 요소 자체를 관찰해야 한다면 훅을 사용합니다.

```tsx
import { useViewake } from "viewake-react";

export function FeatureCard() {
  const ref = useViewake<HTMLElement>({
    mode: "once",
    threshold: 0.2,
  });

  return (
    <article ref={ref} data-viewake="fade-up" data-viewake-mode="once">
      기능 설명
    </article>
  );
}
```

`useViewake<HTMLElement>`의 제네릭은 ref가 연결될 DOM 타입을 TypeScript에
알려줍니다. `article` 대신 `HTMLDivElement`처럼 더 구체적인 타입도 쓸 수
있습니다.

## Next.js App Router

어댑터에는 자체 `"use client"` 경계가 있습니다. 따라서 Server Component에서
컴포넌트를 불러와 렌더링할 수 있습니다.

```tsx
// app/page.tsx — Server Component
import { Viewake } from "viewake-react";

export default function Page() {
  return (
    <main>
      <Viewake animation="fade-up">
        <section>Client Component 경계 안의 콘텐츠</section>
      </Viewake>
    </main>
  );
}
```

전역 CSS는 루트 레이아웃에서 가져옵니다.

```tsx
// app/layout.tsx
import "viewake/styles.css";

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
```

`"use client"`는 페이지 전체를 클라이언트 렌더링으로 바꾼다는 뜻이 아닙니다.
Viewake 어댑터부터 브라우저 API를 사용하는 작은 경계가 시작된다는 뜻입니다.

## 생명주기

어댑터는 `useEffect`에서 컨트롤러를 만들고 effect cleanup에서
`destroy()`합니다. 서버 렌더링 중에는 effect가 실행되지 않으므로 `window`나
`document`에도 접근하지 않습니다.

React 개발 모드의 Strict Mode에서는 effect가 연결·정리·재연결될 수 있습니다.
cleanup이 포함된 이유가 바로 이 상황에서도 observer를 중복으로 남기지 않기
위해서입니다.

## CSS Module과 함께 사용

```tsx
import styles from "./card.module.css";

<Viewake
  animation="fade-up"
  className={styles.card}
  options={{ threshold: 0.25 }}
>
  ...
</Viewake>
```

프로젝트 디자인 클래스는 `className`으로 전달하고 Viewake 설정은 `data-*`
속성으로 분리됩니다. 시각 조정은 CSS Module에서 Viewake 변수만 덮어쓰면 됩니다.

```css
.card {
  --viewake-duration: 720ms;
  --viewake-distance: 32px;
}
```

## 실습 완료 조건

- 컴포넌트 방식과 훅 방식으로 각각 요소 하나를 등장시켰다.
- Next.js 루트 레이아웃에서 CSS를 한 번만 import했다.
- `"use client"` 경계와 `useEffect` cleanup이 필요한 이유를 설명할 수 있다.
