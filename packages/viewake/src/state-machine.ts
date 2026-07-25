import type {
  ViewakeElementState,
  ViewakeMode,
} from "./types.js";

export type ViewakeStateEvent = "ENTER_FROM_BELOW" | "EXIT_BELOW";

export type ViewakeStateTransition = {
  state: ViewakeElementState;
  effect: "awake" | "sleep" | null;
};

export function transitionViewakeState(
  state: ViewakeElementState,
  event: ViewakeStateEvent,
  mode: ViewakeMode,
): ViewakeStateTransition {
  if (state === "sleeping" && event === "ENTER_FROM_BELOW") {
    return {
      state: "awake",
      effect: "awake",
    };
  }

  if (
    state === "awake" &&
    event === "EXIT_BELOW" &&
    mode === "replay"
  ) {
    return {
      state: "sleeping",
      effect: "sleep",
    };
  }

  return {
    state,
    effect: null,
  };
}
