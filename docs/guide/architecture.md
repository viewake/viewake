# How it works

This chapter follows Viewake from initialization to a CSS transition.

## Only the integration entry point changes

```text
Plain JavaScript or CDN: init()
React component or hook: createViewake().observe(element) internally
Vue directive: createViewake().observe(element) during mounted
```

React and Vue users do not add another `init()` call. Every integration shares the same core below the controller boundary.

## Runtime flow

```txt
integration creates a controller
  ↓
provide data-viewake targets
  ↓
classify initial position: above / inside / below
  ↓
below → data-viewake-state="pending"
above or inside → data-viewake-state="active"
  ↓
IntersectionObserver reports a boundary change
  ↓
two-state machine chooses sleeping / awake
  ↓
dataset changes pending / active
  ↓
CSS transition runs
```

## Initial geometry

```ts
const rect = element.getBoundingClientRect();
const viewport = {
  top: 0,
  bottom: window.innerHeight,
};
```

| Position | Test | Initial state |
| --- | --- | --- |
| above | `rect.bottom <= viewport.top` | `active` |
| inside | neither outside condition | `active` |
| below | `rect.top >= viewport.bottom` | `pending` |

Only unseen content below the viewport starts pending. Hiding content already
inside the viewport would produce a flash during initialization or hydration.

## Intersection observation

```ts
const observer = new IntersectionObserver(handleEntries, {
  root: null,
  rootMargin: "0px",
  threshold: [0, 0.15],
});
```

The browser reports relevant intersection changes. Viewake does not run a
layout-reading loop for every scroll event.

## Entry from below

```ts
if (
  state === "sleeping" &&
  entry.isIntersecting &&
  entry.intersectionRatio >= threshold
) {
  transition("ENTER_FROM_BELOW");
}
```

The DOM effect is deliberately small:

```ts
element.dataset.viewakeState = "active";
```

## Direction-aware reset

Non-intersection does not say which side the element left through. Replay also
checks geometry:

```ts
const completelyBelow =
  entry.boundingClientRect.top >= entry.rootBounds.bottom;
```

Only an awake replay element completely below its root returns to pending.

## Cleanup

`destroy()` disconnects both observers, removes Viewake-owned state attributes,
and clears the tracked element map. This matters in SPAs where screens mount
and unmount repeatedly.

## Complexity

Initialization is `O(n)` for `n` targets. After that, Viewake processes only
entries delivered by the browser instead of scanning every element on every
scroll event.

## Practice completion

- Explain why only below elements start pending.
- Distinguish intersection information from geometry information.
- Trace the path from your chosen integration entry point to a CSS transition.
