# viewake-react

React and Next.js adapter for Viewake.

## Install

```bash
npm install viewake viewake-react
```

Import the stylesheet once in the application root:

```tsx
import "viewake/styles.css";
```

## Component

```tsx
import { Viewake } from "viewake-react";

export function Card() {
  return (
    <Viewake
      animation="zoom-in"
      mode="replay"
      delay={150}
      duration={900}
      easing="ease-out"
      className="product-card"
    >
      Content
    </Viewake>
  );
}
```

The component renders a `div`. Project styles remain in `className`; Viewake
settings are rendered as `data-viewake-*` attributes.

## Hook

Use the hook when the semantic element itself should be observed:

```tsx
import { useViewake } from "viewake-react";

export function Feature() {
  const ref = useViewake<HTMLElement>({
    mode: "once",
    threshold: 0.2,
  });

  return (
    <article ref={ref} data-viewake="fade-up">
      Content
    </article>
  );
}
```

The adapter includes the `"use client"` boundary for Next.js App Router and
disconnects its controller during React effect cleanup.

MIT
