import { createViewake } from "./controller.js";
import type { ViewakeOptions } from "./types.js";

export { createViewake };
export {
  classifyInitialPosition,
  isCompletelyBelowRoot,
} from "./geometry.js";
export { transitionViewakeState } from "./state-machine.js";
export type {
  ViewakeAnimation,
  ViewakeController,
  ViewakeElementOptions,
  ViewakeElementState,
  ViewakeEventDetail,
  ViewakeEventName,
  ViewakeMode,
  ViewakeOptions,
  ViewakePreset,
  ViewakeTarget,
} from "./types.js";

export function init(options: ViewakeOptions = {}) {
  return createViewake(options).observe();
}
