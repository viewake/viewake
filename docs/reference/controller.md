# Controller and events

## `init(options?)`

Creates a controller and immediately observes the configured selector.

```ts
const controller = init({
  mode: "replay",
});
```

## `createViewake(options?)`

Creates a controller without observing elements.

```ts
const controller = createViewake({
  threshold: 0.2,
});

controller.observe();
```

## `observe(targets?)`

Accepts a selector, element, iterable, or array-like collection.

```ts
controller.observe();
controller.observe(".feature");
controller.observe(document.querySelector(".hero"));
controller.observe(document.querySelectorAll(".card"));
```

Without an argument, it uses the default `[data-viewake]` selector.

## `refresh()`

Finds newly matching elements and removes disconnected elements.

```ts
controller.refresh();
```

Mutation observation is enabled by default, so manual refresh is mainly useful
when it has been disabled.

## `unobserve(targets)`

Stops observing targets and removes Viewake-owned state.

```ts
controller.unobserve(".temporary-card");
```

## `destroy()`

Disconnects the intersection and mutation observers and cleans every tracked
element.

```ts
controller.destroy();
```

## DOM events

Events bubble from the animated element.

```ts
document.addEventListener("viewake:awake", (event) => {
  const { sequence, timestamp, animation } = event.detail;
  console.log(sequence, timestamp, "awake", animation);
});

document.addEventListener("viewake:sleep", (event) => {
  const { sequence, timestamp, animation } = event.detail;
  console.log(sequence, timestamp, "sleep", animation);
});
```

The detail contains:

```ts
type ViewakeEventDetail = {
  element: Element;
  mode: "once" | "replay";
  animation: string;
  sequence: number;
  timestamp: number;
};
```

`viewake:sleep` occurs only for `replay`, after the element is completely below
the viewport.

`animation` is the element's `data-viewake` value.
`sequence` increases for every actual transition in one controller, so it is
the reliable field for ordering logs. `timestamp` records the transition time
in Unix milliseconds. Log primitive fields as above instead of an expandable
DOM object, which browser consoles can display using the element's later state.

## Practice completion

- Pass a selector, one element, and a `NodeList` to `observe()`.
- Listen for `viewake:awake` from one parent container.
- Explain the difference in scope between `unobserve()` and `destroy()`.
