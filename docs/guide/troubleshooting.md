# Troubleshooting

First separate three cases: missing CSS, observation never started, or an element that correctly started active.

## 1. Confirm the integration

| Environment | Starts observation |
| --- | --- |
| Plain JavaScript | `init()` |
| CDN | `Viewake.init()` |
| React component | `<Viewake>` automatically |
| React hook | `useViewake()` observes its ref |
| Vue | plugin or local directive |

Do not add `init()` to targets already managed by the React or Vue adapter.

## 2. Nothing animates

Import the stylesheet once:

```ts
import "viewake/styles.css";
```

Confirm that the real target has an animation:

```html
<div data-viewake="fade-up">...</div>
```

- `<Viewake animation="fade-up">` generates the attribute.
- A React hook target needs a manually written `data-viewake`.
- `v-viewake="'fade-up'"` generates it in Vue.

Inspect `data-viewake-state`:

```text
pending → observed and waiting below
active  → already active
missing → integration or target connection problem
```

When state is missing, check the environment-specific connection: core `init()`, the React wrapper, the hook ref, or Vue plugin/directive registration.

## 3. The element starts active

Elements already above or inside the viewport intentionally start active. This prevents a flash during initialization and hydration. Put enough space above the test element so it begins below the viewport.

## 4. `<Viewake>` changed my React layout

The component inserts a `div`. Use the hook when a Grid/Flex direct child or semantic structure such as `ul > li` must remain unchanged.

```tsx
const ref = useViewake<HTMLLIElement>();

return (
  <li ref={ref} data-viewake="fade-up">
    Item
  </li>
);
```

## 5. `v-viewake="fade-up"` fails in Vue

Directive values are JavaScript expressions. Pass a string:

```vue
<article v-viewake="'fade-up'">...</article>
```

## 6. Replay does not run again

The element must return **completely below** the viewport before it resets. A partially visible element remains active. Content that leaves above also remains active by design; Viewake has no mirror exit mode.

## 7. A custom scroll container does not work

Pass the element that actually scrolls:

```ts
const root = document.querySelector(".scroll-panel");
const controller = createViewake({ root });

controller.observe(".panel-card");
```

React passes the same root through the `<Viewake>` component's `options` prop. Vue can configure it with `createViewakePlugin({ root })`.

## 8. Dynamically inserted elements do not animate

Core mutation observation is enabled by default. If disabled, refresh manually:

```ts
controller.refresh();
```

React and Vue adapters observe elements when the framework mounts them, so ordinary conditional rendering does not need core mutation scanning.

## 9. Test runners lack IntersectionObserver

JSDOM may not provide `IntersectionObserver`. Register a mock or unit-test the exported state-machine functions directly.

## Debug checklist

1. Did you choose one matching integration?
2. Is the stylesheet imported once?
3. Does the real target have `data-viewake`?
4. Is the component, ref, or directive connected?
5. Is state pending or active?
6. Did the element start inside the viewport?
7. Is reduced motion enabled?
8. Does the configured root match the real scroller?

## Completion check

- Distinguish missing state, pending, and active.
- Explain core `init()` versus adapter-managed observation.
- Fix a React wrapper issue with the hook.
- Verify the exact position that resets replay.
