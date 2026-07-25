# Once and replay

## Once

```html
<div data-viewake="fade-up" data-viewake-mode="once">...</div>
```

The element activates on its first entry and stays active. Observation stops after that reveal.

## Replay

```html
<div data-viewake="fade-up" data-viewake-mode="replay">...</div>
```

The element activates when entering from below, stays active when it passes above the viewport, and resets only after it is completely below the viewport again. The next downward pass replays it. There is no mirror-style disappearance above the viewport.

```text
below (pending) → enter → active
                       └─ replay + completely below again → pending
```

## Set a default mode

Plain JavaScript passes the default to the core:

```js
import { init } from "viewake";

init({ mode: "replay" });
```

React uses `<Viewake mode="replay">` or `useViewake({ mode: "replay" })`. Vue uses a directive object or `createViewakePlugin({ mode: "replay" })`. Do not add `init()` when an adapter already owns the element.

## Completion check

- You verified that neither mode hides an element above the viewport.
- You verified that only replay resets after returning below.
