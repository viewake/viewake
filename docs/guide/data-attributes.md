# Data attribute model

Viewake uses `data-*` attributes for its public HTML API, leaving project class names free for your own styling.

```html
<article
  class="product-card"
  data-viewake="slide-left"
  data-viewake-mode="replay"
  data-viewake-delay="300"
  data-viewake-duration="800"
  data-viewake-easing="ease-out"
>
  ...
</article>
```

| Attribute | Default | Purpose |
| --- | --- | --- |
| `data-viewake` | required | Marks the target and selects its animation |
| `data-viewake-mode` | global mode, then `once` | `once` or `replay` |
| `data-viewake-delay` | global delay, then `0` | Non-negative delay in milliseconds |
| `data-viewake-duration` | global duration, then `600` | Playback time in milliseconds |
| `data-viewake-easing` | global easing | CSS easing value |
| `data-viewake-state` | automatic | Internal `pending`/`active` state |

Per-element mode, delay, duration, and easing override global options. Invalid
mode or numeric timing values fall back to the global values.

## Arbitrary delays

```html
<div data-viewake="fade-up" data-viewake-delay="75">75ms</div>
<div data-viewake="fade-up" data-viewake-delay="1250">1.25s</div>
```

Viewake passes timing through CSS variables, so delay and duration are not
limited to fixed steps.

## Completion check

- You changed an animation without changing project classes.
- You overrode mode, delay, and duration on one element.
- You know why `data-viewake-state` should not be authored manually.
