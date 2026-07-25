# React and Next.js

Do not call `init()` when you use `viewake-react`. Its component and hook observe only the element they own and clean up automatically when that element unmounts.

## Choose the API before writing code

| Situation | Use |
| --- | --- |
| An extra `div` is acceptable and you want the shortest setup | `<Viewake>` |
| The existing `article`, `li`, or Grid/Flex child must remain the real target | `useViewake()` |
| You need to scan plain HTML outside React | core `init()` |

Start with `<Viewake>` in most components. Reach for the hook only when the wrapper would break layout or semantic HTML. Do not combine the component, hook, and `init()` on the same element.

## 1. Install

```bash
npm install viewake viewake-react
```

`viewake` contains the core and CSS presets. `viewake-react` connects that core to React's lifecycle.

## 2. Import the CSS once

In a Vite React app:

```tsx
// src/main.tsx
import "viewake/styles.css";
```

In a Next.js App Router project:

```tsx
// app/layout.tsx
import "viewake/styles.css";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

## 3. Default choice: `<Viewake>`

```tsx
import { Viewake } from "viewake-react";

export function FeatureCard() {
  return (
    <Viewake
      animation="fade-up"
      mode="once"
      className="feature-card"
    >
      <h2>Fast search</h2>
      <p>Find results at a glance.</p>
    </Viewake>
  );
}
```

That is the complete JavaScript setup. Do not add this:

```tsx
// Not needed with the React adapter:
// import { init } from "viewake";
// init();
```

`Viewake` renders a real `div`, and that `div` is the observed and animated element.

```html
<div
  class="feature-card"
  data-viewake="fade-up"
  data-viewake-mode="once"
>
  <h2>Fast search</h2>
  <p>Find results at a glance.</p>
</div>
```

Common settings are direct props:

```tsx
<Viewake
  animation="zoom-in"
  mode="replay"
  delay={200}
  duration={900}
  easing="ease-out"
>
  Content
</Viewake>
```

Use `options` only for controller-level settings such as the trigger ratio or observation boundary:

```tsx
<Viewake
  animation="fade-up"
  options={{
    threshold: 0.25,
    rootMargin: "0px 0px -40px 0px",
  }}
>
  Content
</Viewake>
```

## 4. Use `useViewake()` only when a wrapper is wrong

The hook adds no DOM. Attach its ref to the element that should be observed.

```tsx
import { useViewake } from "viewake-react";

export function FeatureArticle() {
  const ref = useViewake<HTMLElement>({
    mode: "once",
    threshold: 0.2,
  });

  return (
    <article ref={ref} data-viewake="fade-up">
      <h2>The article itself moves</h2>
    </article>
  );
}
```

This renders the `article` without an extra wrapper.

### A concrete hook use case: list items

An unordered list must have `li` elements as its direct children. Wrapping an `li` in the component would insert a `div` in the wrong place.

```tsx
// Avoid: Viewake inserts a div directly under ul.
<ul>
  <Viewake animation="fade-up">
    <li>First feature</li>
  </Viewake>
</ul>
```

Observe the `li` itself instead:

```tsx
import { useViewake } from "viewake-react";

export function FeatureItem() {
  const ref = useViewake<HTMLLIElement>();

  return (
    <li ref={ref} data-viewake="fade-up">
      First feature
    </li>
  );
}
```

The generic tells TypeScript which DOM type receives the ref. The animation name stays on `data-viewake`; it is not a hook option.

## 5. Next.js App Router

The adapter entry already has a `"use client"` boundary, so a Server Component can render `<Viewake>` directly.

```tsx
// app/page.tsx — Server Component
import { Viewake } from "viewake-react";

export default function Page() {
  return (
    <main>
      <Viewake animation="fade-up">
        <h2>An animated region inside a server page</h2>
      </Viewake>
    </main>
  );
}
```

This boundary does not turn the whole page into client-rendered content. It starts at the small adapter component that needs the observer.

Your own component must be a Client Component when it calls the hook:

```tsx
"use client";

import { useViewake } from "viewake-react";

export function FeatureArticle() {
  const ref = useViewake<HTMLElement>();

  return (
    <article ref={ref} data-viewake="fade-up">
      Content
    </article>
  );
}
```

## 6. Lifecycle

Both APIs follow the same lifecycle:

```text
React mount
→ find the DOM through a ref
→ create a Viewake controller
→ observe that one element
→ React unmount
→ destroy the controller
```

The controller is created in `useEffect`, so server rendering does not access `window` or `document`. Cleanup also prevents duplicate observers when Strict Mode reconnects effects during development.

## 7. CSS Modules

```tsx
import styles from "./feature-card.module.css";

<Viewake
  animation="fade-up"
  className={styles.card}
  options={{ threshold: 0.25 }}
>
  Content
</Viewake>
```

```css
.card {
  --viewake-duration: 720ms;
  --viewake-distance: 32px;
}
```

## FAQ

### Do I call `init()` in React?

No. The component and hook start observation internally.

### Which API should I try first?

Use `<Viewake>` unless its extra `div` breaks semantic HTML or layout. Use the hook for that exception.

### Can both APIs exist on one page?

Yes, on different elements. Do not observe the same element twice.

## Completion check

- Reveal an element with `<Viewake>` and explain why `init()` is unnecessary.
- Inspect the extra `div` rendered by the component.
- Use `useViewake<HTMLLIElement>()` where a list item must remain a direct child.
- Import the CSS once from the Next.js root layout.
- Explain why only a component that calls the hook needs its own `"use client"`.
