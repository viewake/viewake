import assert from "node:assert/strict";
import test from "node:test";

import {
  classifyInitialPosition,
  createViewake,
  isCompletelyBelowRoot,
  transitionViewakeState,
} from "../packages/viewake/dist/index.js";

test("once wakes on the first entry from below", () => {
  assert.deepEqual(
    transitionViewakeState("sleeping", "ENTER_FROM_BELOW", "once"),
    {
      state: "awake",
      effect: "awake",
    },
  );
});

test("once stays awake after leaving below", () => {
  assert.deepEqual(
    transitionViewakeState("awake", "EXIT_BELOW", "once"),
    {
      state: "awake",
      effect: null,
    },
  );
});

test("replay sleeps only after the awake element exits below", () => {
  assert.deepEqual(
    transitionViewakeState("awake", "EXIT_BELOW", "replay"),
    {
      state: "sleeping",
      effect: "sleep",
    },
  );
});

test("an exit cannot reset an element that has never awakened", () => {
  assert.deepEqual(
    transitionViewakeState("sleeping", "EXIT_BELOW", "replay"),
    {
      state: "sleeping",
      effect: null,
    },
  );
});

test("initial geometry separates above, visible, and below elements", () => {
  const root = { top: 0, bottom: 800 };

  assert.equal(
    classifyInitialPosition({ top: -200, bottom: -20 }, root),
    "above",
  );
  assert.equal(
    classifyInitialPosition({ top: 200, bottom: 500 }, root),
    "inside",
  );
  assert.equal(
    classifyInitialPosition({ top: 800, bottom: 1000 }, root),
    "below",
  );
});

test("sleep uses the bottom edge, not a generic non-intersection", () => {
  const root = { top: 0, bottom: 800 };

  assert.equal(
    isCompletelyBelowRoot({ top: -300, bottom: -100 }, root),
    false,
  );
  assert.equal(
    isCompletelyBelowRoot({ top: 800, bottom: 1000 }, root),
    true,
  );
});

test("the public controller is safe to create during SSR", () => {
  const controller = createViewake();

  assert.doesNotThrow(() => {
    controller.observe().refresh().destroy();
  });
});
