"use client";

import type { HTMLAttributes } from "react";

import type {
  ViewakeAnimation,
  ViewakeMode,
} from "viewake";

import {
  useViewake,
  type UseViewakeOptions,
} from "./use-viewake.js";

export type ViewakeProps = HTMLAttributes<HTMLDivElement> & {
  animation?: ViewakeAnimation;
  delay?: number;
  duration?: number;
  easing?: string;
  mode?: ViewakeMode;
  options?: Omit<
    UseViewakeOptions,
    "mode" | "delay" | "duration" | "easing"
  >;
};

export function Viewake({
  animation = "fade-up",
  children,
  className,
  delay,
  duration,
  easing,
  mode = "once",
  options,
  ...props
}: ViewakeProps) {
  const ref = useViewake<HTMLDivElement>({
    ...options,
    mode,
    delay,
    duration,
    easing,
  });

  return (
    <div
      {...props}
      className={className}
      data-viewake={animation}
      data-viewake-delay={delay}
      data-viewake-duration={duration}
      data-viewake-easing={easing}
      data-viewake-mode={mode}
      ref={ref}
    >
      {children}
    </div>
  );
}
