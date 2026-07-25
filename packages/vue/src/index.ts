import type {
  App,
  DirectiveBinding,
  ObjectDirective,
  Plugin,
} from "vue";
import {
  createViewake,
  type ViewakeAnimation,
  type ViewakeController,
  type ViewakeMode,
  type ViewakeOptions,
} from "viewake";

export type ViewakeDirectiveValue =
  | ViewakeAnimation
  | {
      animation?: ViewakeAnimation;
      delay?: number;
      duration?: number;
      easing?: string;
      mode?: ViewakeMode;
    };

const controllers = new WeakMap<HTMLElement, ViewakeController>();

function normalizeBindingValue(value: ViewakeDirectiveValue | null | undefined) {
  return typeof value === "string"
    ? { animation: value }
    : (value ?? {});
}

function applyBinding(
  element: HTMLElement,
  binding: DirectiveBinding<ViewakeDirectiveValue>,
) {
  const value = normalizeBindingValue(binding.value);
  element.dataset.viewake = value.animation ?? "fade-up";
  element.dataset.viewakeMode = value.mode ?? "once";

  if (value.delay !== undefined) {
    element.dataset.viewakeDelay = String(value.delay);
  }

  if (value.duration !== undefined) {
    element.dataset.viewakeDuration = String(value.duration);
  }

  if (value.easing !== undefined) {
    element.dataset.viewakeEasing = value.easing;
  }
}

function clearBinding(element: HTMLElement) {
  delete element.dataset.viewake;
  delete element.dataset.viewakeMode;
  delete element.dataset.viewakeDelay;
  delete element.dataset.viewakeDuration;
  delete element.dataset.viewakeEasing;
}

function bindingChanged(
  value: ViewakeDirectiveValue | null | undefined,
  oldValue: ViewakeDirectiveValue | null | undefined,
) {
  const next = normalizeBindingValue(value);
  const previous = normalizeBindingValue(oldValue);

  return (
    next.animation !== previous.animation ||
    next.delay !== previous.delay ||
    next.duration !== previous.duration ||
    next.easing !== previous.easing ||
    next.mode !== previous.mode
  );
}

export function createViewakeDirective(
  options: ViewakeOptions = {},
): ObjectDirective<HTMLElement, ViewakeDirectiveValue> {
  const start = (
    element: HTMLElement,
    binding: DirectiveBinding<ViewakeDirectiveValue>,
  ) => {
    controllers.get(element)?.destroy();
    clearBinding(element);
    applyBinding(element, binding);

    const controller = createViewake({
      ...options,
      observeMutations: false,
    });
    controllers.set(element, controller);
    controller.observe(element);
  };

  return {
    mounted(element, binding) {
      start(element, binding);
    },

    updated(element, binding) {
      if (bindingChanged(binding.value, binding.oldValue)) {
        start(element, binding);
      }
    },

    unmounted(element) {
      controllers.get(element)?.destroy();
      controllers.delete(element);
      clearBinding(element);
    },
  };
}

export function createViewakePlugin(
  options: ViewakeOptions = {},
): Plugin {
  return {
    install(app: App) {
      app.directive("viewake", createViewakeDirective(options));
    },
  };
}

export const vViewake = createViewakeDirective();
export const ViewakePlugin = createViewakePlugin();
