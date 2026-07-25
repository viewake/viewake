# Options

Pass options to `init()` or `createViewake()`.

These examples start with the plain JavaScript core API. React and Vue pass the
same core options through their adapters and do not add an `init()` call.

```js
import { init } from "viewake";

init({
  threshold: 0.25,
  mode: "once",
  delay: 0,
  duration: 600,
  easing: "cubic-bezier(0.22, 1, 0.36, 1)",
  respectReducedMotion: true,
});
```

| Option | Type | Default | Purpose |
| --- | --- | --- | --- |
| `selector` | `string` | `[data-viewake]` | Targets discovered automatically |
| `root` | `Element \| null` | `null` | Scroll viewport; `null` means the browser viewport |
| `rootMargin` | `string` | `0px` | Virtual margin around the root |
| `threshold` | `number` | `0.15` | Required visible ratio from 0 to 1 |
| `mode` | `once \| replay` | `once` | Global playback behavior |
| `delay` | `number` | `0` | Global delay in milliseconds |
| `duration` | `number` | `600` | Global playback time in milliseconds |
| `easing` | `string` | `cubic-bezier(...)` | Global CSS easing |
| `observeMutations` | `boolean` | `true` | Discover dynamically inserted targets |
| `respectReducedMotion` | `boolean` | `true` | Honor reduced-motion preferences |
| `onAwake` | `function` | — | Called after activation |
| `onSleep` | `function` | — | Called when replay resets |

## Passing options through framework adapters

The React component separates common element timing from controller options:

```tsx
<Viewake
  animation="fade-up"
  mode="replay"
  delay={200}
  duration={900}
  options={{
    threshold: 0.25,
    rootMargin: "0px 0px -40px 0px",
  }}
>
  Content
</Viewake>
```

The hook accepts core options while the animation stays on the real element:

```tsx
const ref = useViewake<HTMLElement>({
  mode: "replay",
  threshold: 0.25,
});

return <article ref={ref} data-viewake="fade-up">...</article>;
```

Vue puts application defaults on the plugin and element values on the
directive:

```ts
app.use(createViewakePlugin({ threshold: 0.25, mode: "replay" }));
```

```vue
<article v-viewake="{ animation: 'fade-up', mode: 'once' }">...</article>
```

`onAwake` runs for an actual pending-to-active entry. It does not run for an
element that starts active because it was already inside or above the viewport,
or because reduced motion disabled reveal observation.

Element attributes override global mode and timing:

```html
<div
  data-viewake="fade-up"
  data-viewake-mode="replay"
  data-viewake-delay="400"
  data-viewake-duration="900"
  data-viewake-easing="ease-out"
></div>
```

```js
init({
  onAwake({ element, mode, animation }) {
    console.log(element, mode, animation);
  },
});
```

## Completion check

- Compare thresholds of `0.1` and `0.5`.
- Override global timing on one element.
- Log the current animation from `onAwake`.
