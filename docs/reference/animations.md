# Animation presets

Select every preset with `data-viewake="name"`.

The families were reviewed against the
[official AOS fade, flip, slide, and zoom catalogue](https://github.com/michalsnik/aos)
for familiar naming. Viewake implements them independently with its
direction-aware state machine and CSS variables.

## Fade

`fade`, `fade-up`, `fade-down`, `fade-left`, `fade-right`, `fade-up-right`, `fade-up-left`, `fade-down-right`, and `fade-down-left`.

## Slide

`slide-up`, `slide-down`, `slide-left`, and `slide-right` travel farther than fade presets.

## Zoom

`zoom-in`, `zoom-out`, plus `zoom-in-*` and `zoom-out-*` variants for `up`, `down`, `left`, and `right`.

## Flip

`flip-up`, `flip-down`, `flip-left`, and `flip-right` use 3D rotation. Prefer these for short cards or badges rather than long text.

```html
<div data-viewake="zoom-in" data-viewake-delay="200">Card</div>
```

## Tune the motion

```css
.slow-section {
  --viewake-duration: 900ms;
  --viewake-distance: 40px;
  --viewake-slide-distance: 100px;
  --viewake-easing: cubic-bezier(0.16, 1, 0.3, 1);
}
```

Use `data-viewake-delay`, `data-viewake-duration`, and `data-viewake-easing`
for one-off timing changes. CSS variables are useful when a project class
groups several motion settings.

## Completion check

- You tried one preset from every family.
- You can distinguish duration from delay.
- You selected motion based on the content, not decoration alone.
