export type ViewakeRect = Pick<DOMRectReadOnly, "top" | "bottom">;

export type ViewakeRootBounds = Pick<DOMRectReadOnly, "top" | "bottom">;

export type ViewakeInitialPosition = "above" | "inside" | "below";

export function classifyInitialPosition(
  elementRect: ViewakeRect,
  rootBounds: ViewakeRootBounds,
): ViewakeInitialPosition {
  if (elementRect.top >= rootBounds.bottom) {
    return "below";
  }

  if (elementRect.bottom <= rootBounds.top) {
    return "above";
  }

  return "inside";
}

export function isCompletelyBelowRoot(
  elementRect: ViewakeRect,
  rootBounds: ViewakeRootBounds,
) {
  return elementRect.top >= rootBounds.bottom;
}
