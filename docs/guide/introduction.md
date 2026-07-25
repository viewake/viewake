# Introduction

Viewake is a reveal-animation library with one strict rule:

> An animation begins only when a sleeping element enters from below its viewport.

Most reveal libraries reduce behavior to whether an element intersects the
viewport. That makes leaving through the top and leaving through the bottom
look identical. Viewake preserves the element's state instead.

## The two states

```txt
sleeping → awake
```

- `sleeping`: the element is below the viewport and ready to animate.
- `awake`: the element has already been revealed.

Elements above or inside the viewport during initialization start awake. This
prevents hidden content during hydration and avoids an unexpected animation
when a page opens halfway down.

## Why there is no mirror mode

Viewake does not animate content out as it passes above the viewport. Reading
content should remain stable while the user scrolls. An element leaving through
the top stays awake.

`replay` is prepared only after the user returns above the element and the
element is completely below the viewport. The reset happens offscreen.

## Browser model

Viewake uses `IntersectionObserver` rather than a continuous scroll listener.
CSS handles opacity and transform transitions.

```txt
IntersectionObserver
        ↓
sleeping / awake state
        ↓
pending / active data states
        ↓
CSS transition
```

## Design goals

- Predictable scrolling behavior
- Visible content without JavaScript
- Safe imports in SSR environments
- A small framework-independent core
- Explicit lifecycle methods
- Accessible motion defaults

Continue with the [data attribute model](/guide/data-attributes) to see why the
core never writes visual styles.

## Learning checkpoint

You should now be able to explain:

- Why `isIntersecting` alone cannot distinguish an exit above from an exit below
- Why elements initially above or inside the viewport start awake
- Which responsibilities belong to Viewake's JavaScript and which belong to CSS
