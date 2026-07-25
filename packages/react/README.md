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

Do not call the core `init()` when this adapter owns the element. The component
and hook start observation and clean it up automatically.

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

The component is the default choice and renders one `div`. Use the hook only
when that wrapper would break semantic HTML, Grid/Flex layout, or a list whose
direct child must remain an `li`:

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

Read the complete [React and Next.js guide](https://viewake.github.io/viewake/frameworks/react-next).

MIT
