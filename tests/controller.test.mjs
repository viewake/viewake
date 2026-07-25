import assert from "node:assert/strict";
import test from "node:test";

import { createViewake } from "../packages/viewake/dist/index.js";

class FakeStyle {
  properties = new Map();

  setProperty(name, value) {
    this.properties.set(name, value);
  }

  removeProperty(name) {
    this.properties.delete(name);
  }
}

class FakeElement {
  constructor(dataset, rect) {
    this.dataset = { ...dataset };
    this.rect = rect;
    this.style = new FakeStyle();
    this.isConnected = true;
    this.events = [];
  }

  dispatchEvent(event) {
    this.events.push(event.type);
    return true;
  }

  getBoundingClientRect() {
    return this.rect;
  }

  matches(selector) {
    return selector === "[data-viewake]" && this.dataset.viewake !== undefined;
  }

  querySelectorAll() {
    return [];
  }
}

class FakeCustomEvent {
  constructor(type, init) {
    this.type = type;
    this.detail = init.detail;
    this.bubbles = init.bubbles;
  }
}

class FakeIntersectionObserver {
  static instances = [];

  constructor(callback, options) {
    this.callback = callback;
    this.options = options;
    this.targets = new Set();
    FakeIntersectionObserver.instances.push(this);
  }

  observe(element) {
    this.targets.add(element);
  }

  unobserve(element) {
    this.targets.delete(element);
  }

  disconnect() {
    this.targets.clear();
  }

  trigger(target, {
    intersecting,
    ratio,
    top,
    bottom,
  }) {
    this.callback([
      {
        target,
        isIntersecting: intersecting,
        intersectionRatio: ratio,
        boundingClientRect: { top, bottom },
        rootBounds: { top: 0, bottom: 768 },
      },
    ]);
  }
}

class FakeMutationObserver {
  static instances = [];

  constructor(callback) {
    this.callback = callback;
    this.disconnected = false;
    FakeMutationObserver.instances.push(this);
  }

  observe() {}

  disconnect() {
    this.disconnected = true;
  }

  trigger(records = []) {
    this.callback(records);
  }
}

Object.assign(globalThis, {
  CustomEvent: FakeCustomEvent,
  Element: FakeElement,
  HTMLElement: FakeElement,
  IntersectionObserver: FakeIntersectionObserver,
  MutationObserver: FakeMutationObserver,
  document: {
    body: new FakeElement({}, { top: 0, bottom: 768 }),
    querySelectorAll: () => [],
  },
  window: {
    innerHeight: 768,
    matchMedia: () => ({ matches: false }),
  },
});

test("replay stays awake above and resets only below", () => {
  const element = new FakeElement(
    {
      viewake: "fade-up",
      viewakeMode: "replay",
      viewakeDelay: "180",
    },
    { top: 900, bottom: 1000 },
  );
  const events = [];
  const sequences = [];
  const controller = createViewake({
    observeMutations: false,
    onAwake: (detail) => {
      events.push("awake");
      sequences.push(detail.sequence);
    },
    onSleep: (detail) => {
      events.push("sleep");
      sequences.push(detail.sequence);
    },
  });

  controller.observe(element);
  const observer = FakeIntersectionObserver.instances.at(-1);

  assert.equal(element.dataset.viewakeState, "pending");
  assert.equal(
    element.style.properties.get("--viewake-delay"),
    "180ms",
  );
  assert.equal(
    element.style.properties.get("--viewake-duration"),
    "600ms",
  );

  observer.trigger(element, {
    intersecting: true,
    ratio: 0.5,
    top: 600,
    bottom: 700,
  });
  assert.equal(element.dataset.viewakeState, "active");

  observer.trigger(element, {
    intersecting: false,
    ratio: 0,
    top: -200,
    bottom: -100,
  });
  assert.equal(element.dataset.viewakeState, "active");

  observer.trigger(element, {
    intersecting: false,
    ratio: 0,
    top: 800,
    bottom: 900,
  });
  assert.equal(element.dataset.viewakeState, "pending");

  observer.trigger(element, {
    intersecting: true,
    ratio: 0.5,
    top: 600,
    bottom: 700,
  });
  assert.deepEqual(events, ["awake", "sleep", "awake"]);
  assert.deepEqual(sequences, [1, 2, 3]);
  controller.destroy();
  assert.equal(element.dataset.viewakeState, undefined);
  assert.equal(element.style.properties.size, 0);
});

test("once stops observing immediately after its first wake", () => {
  const element = new FakeElement(
    { viewake: "fade-up" },
    { top: 900, bottom: 1000 },
  );
  const controller = createViewake({
    observeMutations: false,
  });

  controller.observe(element);
  const observer = FakeIntersectionObserver.instances.at(-1);
  assert.equal(observer.targets.has(element), true);

  observer.trigger(element, {
    intersecting: true,
    ratio: 0.5,
    top: 600,
    bottom: 700,
  });

  assert.equal(element.dataset.viewakeState, "active");
  assert.equal(observer.targets.has(element), false);
});

test("invalid element delay falls back to a safe global delay", () => {
  const element = new FakeElement(
    {
      viewake: "zoom-in",
      viewakeDelay: "not-a-number",
    },
    { top: 900, bottom: 1000 },
  );
  const controller = createViewake({
    delay: 120,
    observeMutations: false,
  });

  controller.observe(element);
  assert.equal(
    element.style.properties.get("--viewake-delay"),
    "120ms",
  );
  controller.destroy();
});

test("invalid global delay becomes zero instead of leaking NaN into CSS", () => {
  const element = new FakeElement(
    { viewake: "fade-up" },
    { top: 900, bottom: 1000 },
  );
  const controller = createViewake({
    delay: Number.NaN,
    observeMutations: false,
  });

  controller.observe(element);
  assert.equal(
    element.style.properties.get("--viewake-delay"),
    "0ms",
  );
  controller.destroy();
});

test("invalid threshold falls back to the documented default", () => {
  const element = new FakeElement(
    { viewake: "fade-up" },
    { top: 900, bottom: 1000 },
  );
  const controller = createViewake({
    threshold: Number.NaN,
    observeMutations: false,
  });

  controller.observe(element);
  const observer = FakeIntersectionObserver.instances.at(-1);
  assert.deepEqual(observer.options.threshold, [0, 0.15]);
  controller.destroy();
});

test("timing attributes accept arbitrary milliseconds and easing", () => {
  const element = new FakeElement(
    {
      viewake: "zoom-in",
      viewakeDuration: "875",
      viewakeEasing: "ease-in-out",
    },
    { top: 900, bottom: 1000 },
  );
  const controller = createViewake({
    observeMutations: false,
  });

  controller.observe(element);
  assert.equal(
    element.style.properties.get("--viewake-duration"),
    "875ms",
  );
  assert.equal(
    element.style.properties.get("--viewake-easing"),
    "ease-in-out",
  );
  controller.destroy();
});

test("event detail reads the current animation attribute", () => {
  const element = new FakeElement(
    { viewake: "fade-up" },
    { top: 900, bottom: 1000 },
  );
  let animation;
  const controller = createViewake({
    observeMutations: false,
    onAwake: (detail) => {
      animation = detail.animation;
    },
  });

  controller.observe(element);
  element.dataset.viewake = "zoom-in";
  FakeIntersectionObserver.instances.at(-1).trigger(element, {
    intersecting: true,
    ratio: 0.5,
    top: 600,
    bottom: 700,
  });

  assert.equal(animation, "zoom-in");
  controller.destroy();
});

test("content stays visible when IntersectionObserver is unavailable", () => {
  const OriginalIntersectionObserver = globalThis.IntersectionObserver;
  delete globalThis.IntersectionObserver;

  try {
    const element = new FakeElement(
      { viewake: "fade-up" },
      { top: 900, bottom: 1000 },
    );
    const controller = createViewake({
      observeMutations: false,
    });

    controller.observe(element);
    assert.equal(element.dataset.viewakeState, "active");
    controller.destroy();
  } finally {
    globalThis.IntersectionObserver = OriginalIntersectionObserver;
  }
});

test("mutation observation releases disconnected elements", () => {
  const element = new FakeElement(
    {
      viewake: "fade-up",
      viewakeMode: "replay",
    },
    { top: 100, bottom: 200 },
  );
  const controller = createViewake();

  controller.observe(element);
  const intersectionObserver =
    FakeIntersectionObserver.instances.at(-1);
  const mutationObserver = FakeMutationObserver.instances.at(-1);
  assert.equal(intersectionObserver.targets.has(element), true);

  element.isConnected = false;
  mutationObserver.trigger();

  assert.equal(intersectionObserver.targets.has(element), false);
  controller.destroy();
});
