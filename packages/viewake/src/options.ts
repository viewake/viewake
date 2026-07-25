import type {
  ViewakeElementOptions,
  ViewakeOptions,
} from "./types.js";

export type NormalizedViewakeOptions = Required<
  Omit<ViewakeOptions, "onAwake" | "onSleep">
> &
  Pick<ViewakeOptions, "onAwake" | "onSleep">;

export const defaultViewakeOptions: Required<
  Omit<ViewakeOptions, "onAwake" | "onSleep">
> = {
  selector: "[data-viewake]",
  root: null,
  rootMargin: "0px",
  threshold: 0.15,
  mode: "once",
  delay: 0,
  duration: 600,
  easing: "cubic-bezier(0.22, 1, 0.36, 1)",
  observeMutations: true,
  respectReducedMotion: true,
};

export function resolveElementOptions(
  element: Element,
  options: NormalizedViewakeOptions,
): ViewakeElementOptions {
  const elementData = (element as HTMLElement).dataset;
  const parsedDelay = Number(elementData.viewakeDelay);
  const parsedDuration = Number(elementData.viewakeDuration);

  return {
    mode:
      elementData.viewakeMode === "once" ||
      elementData.viewakeMode === "replay"
        ? elementData.viewakeMode
        : options.mode,
    animation: elementData.viewake?.trim() || "fade-up",
    delay:
      elementData.viewakeDelay !== undefined &&
      Number.isFinite(parsedDelay) &&
      parsedDelay >= 0
        ? parsedDelay
        : options.delay,
    duration:
      elementData.viewakeDuration !== undefined &&
      Number.isFinite(parsedDuration) &&
      parsedDuration >= 0
        ? parsedDuration
        : options.duration,
    easing: elementData.viewakeEasing?.trim() || options.easing,
  };
}

export function normalizeViewakeOptions(
  options: ViewakeOptions = {},
): NormalizedViewakeOptions {
  const requestedThreshold =
    options.threshold ?? defaultViewakeOptions.threshold;
  const threshold = Number.isFinite(requestedThreshold)
    ? Math.min(1, Math.max(0, requestedThreshold))
    : defaultViewakeOptions.threshold;
  const requestedDelay =
    options.delay ?? defaultViewakeOptions.delay;
  const delay =
    Number.isFinite(requestedDelay) && requestedDelay >= 0
      ? requestedDelay
      : defaultViewakeOptions.delay;
  const requestedDuration =
    options.duration ?? defaultViewakeOptions.duration;
  const duration =
    Number.isFinite(requestedDuration) && requestedDuration >= 0
      ? requestedDuration
      : defaultViewakeOptions.duration;
  const easing =
    options.easing?.trim() || defaultViewakeOptions.easing;

  return {
    ...defaultViewakeOptions,
    ...options,
    threshold,
    delay,
    duration,
    easing,
  };
}
