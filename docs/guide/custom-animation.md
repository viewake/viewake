# Write a custom animation

Choose a new data value:

```html
<article data-viewake="blur-up">Custom effect</article>
```

Define only its pending appearance:

```css
[data-viewake="blur-up"][data-viewake-state="pending"] {
  filter: blur(14px);
  transform: translate3d(0, 28px, 0);
}
```

The shared active rule returns opacity, transform, and filter to their visible values. JavaScript needs no changes.

```css
.hero-card {
  --viewake-duration: 900ms;
}
```

```html
<article class="hero-card" data-viewake="blur-up" data-viewake-delay="150">
  ...
</article>
```

Prefer opacity and transform, keep text readable, and retain the built-in reduced-motion rule.

## Completion check

- Add a custom data value without changing JavaScript.
- Keep project classes separate from Viewake attributes.
- Explain the difference between duration and delay.
