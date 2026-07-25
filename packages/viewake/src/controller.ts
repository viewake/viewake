import {
  classifyInitialPosition,
  isCompletelyBelowRoot,
  type ViewakeRootBounds,
} from "./geometry.js";
import {
  normalizeViewakeOptions,
  resolveElementOptions,
} from "./options.js";
import { transitionViewakeState } from "./state-machine.js";
import type {
  ViewakeController,
  ViewakeElementOptions,
  ViewakeElementState,
  ViewakeEventDetail,
  ViewakeOptions,
  ViewakeTarget,
} from "./types.js";

type TrackedElement = {
  options: ViewakeElementOptions;
  state: ViewakeElementState;
};

function isElement(value: unknown): value is Element {
  return (
    typeof Element !== "undefined" &&
    value instanceof Element
  );
}

function getViewportBounds(): ViewakeRootBounds {
  return {
    top: 0,
    bottom:
      typeof window === "undefined"
        ? 0
        : window.innerHeight,
  };
}

function getRootBounds(root: Element | null): ViewakeRootBounds {
  return root?.getBoundingClientRect() ?? getViewportBounds();
}

function getElements(targets: ViewakeTarget, root: Element | null) {
  if (typeof document === "undefined") {
    return [];
  }

  if (typeof targets === "string") {
    return Array.from(
      (root ?? document).querySelectorAll<Element>(targets),
    );
  }

  if (isElement(targets)) {
    return [targets];
  }

  return Array.from(targets).filter(isElement);
}

function setElementState(
  element: HTMLElement,
  state: ViewakeElementState,
) {
  element.dataset.viewakeState =
    state === "awake" ? "active" : "pending";
}

function setElementTiming(
  element: HTMLElement,
  options: ViewakeElementOptions,
) {
  element.style.setProperty("--viewake-delay", `${options.delay}ms`);
  element.style.setProperty(
    "--viewake-duration",
    `${options.duration}ms`,
  );
  element.style.setProperty("--viewake-easing", options.easing);
}

function clearElementState(element: HTMLElement) {
  delete element.dataset.viewakeState;
  element.style.removeProperty("--viewake-delay");
  element.style.removeProperty("--viewake-duration");
  element.style.removeProperty("--viewake-easing");
}

function emitEvent(
  eventName: "viewake:awake" | "viewake:sleep",
  detail: ViewakeEventDetail,
) {
  if (typeof CustomEvent === "undefined") {
    return;
  }

  detail.element.dispatchEvent(
    new CustomEvent(eventName, {
      bubbles: true,
      detail,
    }),
  );
}

export function createViewake(
  options: ViewakeOptions = {},
): ViewakeController {
  const config = normalizeViewakeOptions(options);
  const tracked = new Map<Element, TrackedElement>();
  let observer: IntersectionObserver | null = null;
  let mutationObserver: MutationObserver | null = null;
  let destroyed = false;
  let eventSequence = 0;

  const prefersReducedMotion =
    config.respectReducedMotion &&
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const canObserve =
    typeof IntersectionObserver !== "undefined";

  const pruneDisconnectedElements = () => {
    for (const element of tracked.keys()) {
      if (!element.isConnected) {
        observer?.unobserve(element);
        tracked.delete(element);
      }
    }
  };

  const applyTransition = (
    element: Element,
    event: "ENTER_FROM_BELOW" | "EXIT_BELOW",
  ) => {
    const trackedElement = tracked.get(element);

    if (!trackedElement) {
      return;
    }

    const transition = transitionViewakeState(
      trackedElement.state,
      event,
      trackedElement.options.mode,
    );

    if (!transition.effect) {
      return;
    }

    trackedElement.state = transition.state;
    setElementState(element as HTMLElement, transition.state);

    eventSequence += 1;

    const detail: ViewakeEventDetail = {
      element,
      mode: trackedElement.options.mode,
      animation:
        (element as HTMLElement).dataset.viewake?.trim() ||
        trackedElement.options.animation,
      sequence: eventSequence,
      timestamp: Date.now(),
    };

    if (transition.effect === "awake") {
      emitEvent("viewake:awake", detail);
      config.onAwake?.(detail);

      if (trackedElement.options.mode === "once") {
        observer?.unobserve(element);
      }
    } else {
      emitEvent("viewake:sleep", detail);
      config.onSleep?.(detail);
    }
  };

  const handleEntries: IntersectionObserverCallback = (entries) => {
    for (const entry of entries) {
      const trackedElement = tracked.get(entry.target);

      if (!trackedElement) {
        continue;
      }

      const rootBounds = entry.rootBounds ?? getRootBounds(config.root);

      if (
        trackedElement.state === "sleeping" &&
        entry.isIntersecting &&
        entry.intersectionRatio >= config.threshold
      ) {
        applyTransition(entry.target, "ENTER_FROM_BELOW");
        continue;
      }

      if (
        trackedElement.options.mode === "replay" &&
        !entry.isIntersecting &&
        isCompletelyBelowRoot(entry.boundingClientRect, rootBounds)
      ) {
        applyTransition(entry.target, "EXIT_BELOW");
      }
    }
  };

  const ensureObserver = () => {
    if (
      observer ||
      destroyed ||
      prefersReducedMotion ||
      !canObserve
    ) {
      return observer;
    }

    observer = new IntersectionObserver(handleEntries, {
      root: config.root,
      rootMargin: config.rootMargin,
      threshold: [0, config.threshold],
    });

    return observer;
  };

  const observeElement = (element: Element) => {
    if (destroyed || tracked.has(element)) {
      return;
    }

    const elementOptions = resolveElementOptions(element, config);
    const position = classifyInitialPosition(
      element.getBoundingClientRect(),
      getRootBounds(config.root),
    );
    const state: ViewakeElementState =
      prefersReducedMotion || !canObserve || position !== "below"
        ? "awake"
        : "sleeping";

    tracked.set(element, {
      options: elementOptions,
      state,
    });
    setElementTiming(element as HTMLElement, elementOptions);
    setElementState(element as HTMLElement, state);

    if (
      !prefersReducedMotion &&
      (state === "sleeping" || elementOptions.mode === "replay")
    ) {
      ensureObserver()?.observe(element);
    }
  };

  const controller: ViewakeController = {
    observe(targets = config.selector) {
      if (destroyed) {
        return controller;
      }

      for (const element of getElements(targets, config.root)) {
        observeElement(element);
      }

      if (
        config.observeMutations &&
        !mutationObserver &&
        typeof MutationObserver !== "undefined" &&
        typeof document !== "undefined"
      ) {
        const mutationRoot = config.root ?? document.body;

        if (mutationRoot) {
          mutationObserver = new MutationObserver((records) => {
            pruneDisconnectedElements();

            for (const record of records) {
              for (const node of record.addedNodes) {
                if (!isElement(node)) {
                  continue;
                }

                if (node.matches(config.selector)) {
                  observeElement(node);
                }

                for (const child of node.querySelectorAll(
                  config.selector,
                )) {
                  observeElement(child);
                }
              }
            }
          });
          mutationObserver.observe(mutationRoot, {
            childList: true,
            subtree: true,
          });
        }
      }

      return controller;
    },

    refresh() {
      if (destroyed) {
        return controller;
      }

      controller.observe(config.selector);

      pruneDisconnectedElements();

      for (const [element, trackedElement] of tracked) {
        if (trackedElement.options.mode === "replay") {
          observer?.observe(element);
        }
      }

      return controller;
    },

    unobserve(targets) {
      for (const element of getElements(targets, config.root)) {
        observer?.unobserve(element);
        tracked.delete(element);
        clearElementState(element as HTMLElement);
      }

      return controller;
    },

    destroy() {
      if (destroyed) {
        return;
      }

      destroyed = true;
      observer?.disconnect();
      mutationObserver?.disconnect();
      observer = null;
      mutationObserver = null;

      for (const element of tracked.keys()) {
        clearElementState(element as HTMLElement);
      }

      tracked.clear();
    },
  };

  return controller;
}
