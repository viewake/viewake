# CDN and plain HTML

Use Viewake like AOS with one stylesheet and one global script.

Only the CDN integration calls the global `Viewake.init()`. Do not mix this
setup with the React or Vue adapter on the same targets.

## 1. Load CSS

```html
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/viewake@0.1.0/styles/viewake.css"
/>
```

## 2. Add data attributes

```html
<section data-viewake="fade-up">
  Reveal once
</section>

<section data-viewake="zoom-in" data-viewake-mode="replay" data-viewake-delay="200">
  Replay
</section>
```

## 3. Load and initialize

Place scripts before the closing `body` so the target DOM already exists.

```html
<script src="https://cdn.jsdelivr.net/npm/viewake@0.1.0/dist/viewake.global.js"></script>
<script>
  Viewake.init();
</script>
```

The IIFE build exposes `window.Viewake`.

## Complete page

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link
      rel="stylesheet"
      href="https://cdn.jsdelivr.net/npm/viewake@0.1.0/styles/viewake.css"
    />
  </head>
  <body>
    <main>
      <section data-viewake="fade-up">Once section</section>
      <section data-viewake="zoom-in" data-viewake-mode="replay">
        Replay section
      </section>
    </main>

    <script src="https://cdn.jsdelivr.net/npm/viewake@0.1.0/dist/viewake.global.js"></script>
    <script>
      Viewake.init({ threshold: 0.2 });
    </script>
  </body>
</html>
```

## Extend with CSS

```css
[data-viewake="pop"][data-viewake-state="pending"] {
  opacity: 0;
  transform: scale(0.8);
}
```

CDN usage keeps the same CSS-first extension model.

## Pin versions

Use `@0.1.0` rather than `@latest` in production so a future major release
cannot change a live page unexpectedly.

## Practice completion

- Run Viewake in an otherwise empty HTML file.
- Build once and replay with one data attribute difference.
- Add a `pop` animation without modifying the core.
