# Accessibility and SSR

Scroll motion is decoration. It must not block access to content.

## Visible without JavaScript

The base `[data-viewake]` rule does not hide content. Only a running controller sets
`data-viewake-state="pending"` on elements below the viewport.

```css
[data-viewake] {
  opacity: 1;
}

[data-viewake][data-viewake-state="pending"] {
  opacity: 0;
}
```

A failed script or network request therefore leaves the document readable.

## Reduced motion

The stylesheet removes transitions when the user requests reduced motion.

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

The core also checks the media query and skips intersection observation.

## SSR-safe imports

Reading `window` or `document` at module scope breaks Node.js rendering.
Viewake postpones browser API access until controller methods run.

```ts
// Safe during server rendering
import { createViewake } from "viewake";
```

The React adapter creates its controller in `useEffect`, which does not run on
the server.

## Preserve semantic HTML

Core data attributes, the React `useViewake()` hook, and the Vue directive add
no wrapper. Observe the meaningful element directly.

```html
<article data-viewake="fade-up">
  <h2>Title</h2>
  <p>Body</p>
</article>
```

The React `<Viewake>` component is the one convenience API that renders a
`div`. Use the hook when direct-child semantics such as `ul > li` must remain
unchanged.

Do not add `aria-hidden="true"` for the animation—it would also hide content
from assistive technology.

## Practice completion

- Read the page with JavaScript disabled.
- Confirm that reduced motion disables transitions.
- Import Viewake during server rendering without an exception.
