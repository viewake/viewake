---
layout: home

hero:
  name: Viewake
  text: Wake elements as they enter the view.
  tagline: A tiny, direction-aware reveal library with predictable once and replay modes. Framework-agnostic core, CDN build, React, Next.js, and Vue support.
  actions:
    - theme: brand
      text: Get started
      link: /guide/getting-started
    - theme: alt
      text: Understand replay
      link: /guide/modes
  image:
    src: /brand/icon.png
    alt: Viewake icon

features:
  - title: CSS owns the animation
    details: JavaScript only changes the data-viewake-state attribute. Add a new animation with CSS alone.
  - title: Direction-aware replay
    details: Passing above never hides content. Replay resets only while the element is safely below the viewport.
  - title: Works everywhere
    details: Plain HTML and CDN, React, Next.js, and Vue share the same tiny framework-free core.
  - title: Accessible by default
    details: Content stays visible without JavaScript and reduced-motion preferences are respected automatically.
  - title: SSR safe
    details: Import the core on the server without reading window or document during module evaluation.
  - title: About 2 KB gzipped
    details: IntersectionObserver, a two-state machine, and CSS transitions—without a runtime animation engine.
---

<div class="viewake-home-demo">
  <ViewakePlayground />
</div>
