# Troubleshooting

## Nothing animates

Confirm the required data attribute and stylesheet import.

```html
<div data-viewake="fade-up">...</div>
```

```ts
import "viewake/styles.css";
```

Inspect the element for `data-viewake-state="pending"` or `"active"`. If neither is
present, initialization did not run or the selector does not match.

## The element starts active

Elements already above or inside the viewport intentionally start active. This
prevents a flash during initialization and hydration. Put enough space above
the test element so it begins below the viewport.

## Replay does not run again

Add replay mode:

```html
<div data-viewake="fade-up" data-viewake-mode="replay">...</div>
```

Then return far enough above the element that it is completely below the
viewport. A partially visible element does not reset.

## I want an exit animation above

Viewake intentionally keeps content visible after it passes above. A
bidirectional timeline tool is a better fit when exit animation is required.

## A custom scroll container does not work

Pass the element that actually scrolls:

```ts
const root = document.querySelector(".scroll-panel");
createViewake({ root }).observe();
```

Check that `overflow: auto` is not set on a different ancestor.

## Dynamically inserted elements do not animate

Mutation observation is enabled by default. If you disabled it, observe or
refresh manually:

```ts
controller.observe(newElement);
controller.refresh();
```

## Test runners lack IntersectionObserver

JSDOM may not provide `IntersectionObserver`. Register a mock in test setup or
unit-test the exported state-machine functions directly.

## Debug checklist

1. Is the stylesheet imported?
2. Does the target have `data-viewake`?
3. Did `init()` or `observe()` run?
4. Is `data-viewake-state` pending or active?
5. Is reduced motion enabled?
6. Does the configured root match the real scroll container?

## Completion check

- Inspect `data-viewake-state` and the three timing CSS variables.
- Explain the exact condition that resets replay.
- Distinguish missing JavaScript, missing CSS, and an incorrect root.
