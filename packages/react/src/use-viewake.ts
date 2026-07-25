"use client";

import { useEffect, useRef } from "react";
import {
  createViewake,
  type ViewakeOptions,
} from "viewake";

export type UseViewakeOptions = Omit<
  ViewakeOptions,
  "selector" | "observeMutations"
>;

export function useViewake<T extends HTMLElement>(
  options: UseViewakeOptions = {},
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    const controller = createViewake({
      ...options,
      observeMutations: false,
    });
    controller.observe(ref.current);

    return () => {
      controller.destroy();
    };
  }, [
    options.delay,
    options.duration,
    options.easing,
    options.mode,
    options.onAwake,
    options.onSleep,
    options.respectReducedMotion,
    options.root,
    options.rootMargin,
    options.threshold,
  ]);

  return ref;
}
