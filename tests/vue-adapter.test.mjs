import assert from "node:assert/strict";
import test from "node:test";

import { createViewakeDirective } from "../packages/vue/dist/index.js";

class FakeStyle {
  setProperty() {}
  removeProperty() {}
}

class FakeElement {
  constructor() {
    this.dataset = {};
    this.style = new FakeStyle();
    this.isConnected = true;
  }

  dispatchEvent() {
    return true;
  }

  getBoundingClientRect() {
    return { top: 900, bottom: 1000 };
  }

  querySelectorAll() {
    return [];
  }
}

class FakeIntersectionObserver {
  static latest;

  constructor(callback) {
    this.callback = callback;
    FakeIntersectionObserver.latest = this;
  }

  observe() {}
  unobserve() {}
  disconnect() {}

  trigger(target, {
    isIntersecting,
    intersectionRatio,
    top,
    bottom,
  }) {
    this.callback([
      {
        target,
        isIntersecting,
        intersectionRatio,
        boundingClientRect: { top, bottom },
        rootBounds: { top: 0, bottom: 768 },
      },
    ]);
  }
}

Object.assign(globalThis, {
  CustomEvent: class {
    constructor(type, init) {
      this.type = type;
      this.detail = init.detail;
    }
  },
  Element: FakeElement,
  HTMLElement: FakeElement,
  IntersectionObserver: FakeIntersectionObserver,
  document: {
    body: new FakeElement(),
    querySelectorAll: () => [],
  },
  window: {
    innerHeight: 768,
    matchMedia: () => ({ matches: false }),
  },
});

test("Vue directive preserves the plugin replay default", () => {
  const element = new FakeElement();
  const directive = createViewakeDirective({
    mode: "replay",
    observeMutations: false,
  });

  directive.mounted(element, {
    value: "fade-up",
  });

  assert.equal(element.dataset.viewakeMode, undefined);
  assert.equal(element.dataset.viewakeState, "pending");

  FakeIntersectionObserver.latest.trigger(element, {
    isIntersecting: true,
    intersectionRatio: 1,
    top: 600,
    bottom: 700,
  });
  assert.equal(element.dataset.viewakeState, "active");

  FakeIntersectionObserver.latest.trigger(element, {
    isIntersecting: false,
    intersectionRatio: 0,
    top: 900,
    bottom: 1000,
  });
  assert.equal(element.dataset.viewakeState, "pending");
});

test("Vue directive value overrides the plugin mode", () => {
  const element = new FakeElement();
  const directive = createViewakeDirective({
    mode: "replay",
    observeMutations: false,
  });

  directive.mounted(element, {
    value: {
      animation: "fade-up",
      mode: "once",
    },
  });

  assert.equal(element.dataset.viewakeMode, "once");
});
