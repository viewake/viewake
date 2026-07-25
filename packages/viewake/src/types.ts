export type ViewakeMode = "once" | "replay";

export type ViewakePreset =
  | "fade"
  | "fade-up"
  | "fade-down"
  | "fade-left"
  | "fade-right"
  | "fade-up-right"
  | "fade-up-left"
  | "fade-down-right"
  | "fade-down-left"
  | "slide-up"
  | "slide-down"
  | "slide-left"
  | "slide-right"
  | "zoom-in"
  | "zoom-in-up"
  | "zoom-in-down"
  | "zoom-in-left"
  | "zoom-in-right"
  | "zoom-out"
  | "zoom-out-up"
  | "zoom-out-down"
  | "zoom-out-left"
  | "zoom-out-right"
  | "flip-up"
  | "flip-down"
  | "flip-left"
  | "flip-right";

export type ViewakeAnimation =
  | ViewakePreset
  | (string & Record<never, never>);

export type ViewakeElementState = "sleeping" | "awake";

export type ViewakeEventName = "viewake:awake" | "viewake:sleep";

export type ViewakeEventDetail = {
  element: Element;
  mode: ViewakeMode;
  animation: string;
  sequence: number;
  timestamp: number;
};

export type ViewakeElementOptions = {
  mode: ViewakeMode;
  animation: string;
  delay: number;
  duration: number;
  easing: string;
};

export type ViewakeOptions = {
  selector?: string;
  root?: Element | null;
  rootMargin?: string;
  threshold?: number;
  mode?: ViewakeMode;
  delay?: number;
  duration?: number;
  easing?: string;
  observeMutations?: boolean;
  respectReducedMotion?: boolean;
  onAwake?: (detail: ViewakeEventDetail) => void;
  onSleep?: (detail: ViewakeEventDetail) => void;
};

export type ViewakeTarget =
  | string
  | Element
  | Iterable<Element>
  | ArrayLike<Element>;

export type ViewakeController = {
  observe(targets?: ViewakeTarget): ViewakeController;
  refresh(): ViewakeController;
  unobserve(targets: ViewakeTarget): ViewakeController;
  destroy(): void;
};
