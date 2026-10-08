/* eslint-disable react-refresh/only-export-components -- shared motion primitives */
import type { ReactNode } from "react";
import { LazyMotion, domAnimation, m, type Transition, type Variants } from "framer-motion";

/** Use with LazyMotion — lighter than full `motion` bundle. */
export const motion = m;

export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict={false}>
      {children}
    </LazyMotion>
  );
}

export const spring: Transition = {
  type: "spring",
  stiffness: 320,
  damping: 32,
  mass: 0.9,
};

export const softSpring: Transition = {
  type: "spring",
  stiffness: 200,
  damping: 28,
  mass: 1,
};

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18, filter: "blur(4px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: spring,
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  show: { opacity: 1, scale: 1, transition: spring },
};

export const stagger = (delayChildren = 0.06, staggerChildren = 0.07): Variants => ({
  hidden: {},
  show: {
    transition: { delayChildren, staggerChildren },
  },
});

export const viewportOnce = { once: true, amount: 0.2 } as const;

/** Studio pages: transform-only entrance (opacity stays 1 for first paint). */
export const studioReveal: Variants = {
  hidden: { opacity: 1, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 380, damping: 34, mass: 0.85 },
  },
};

export const studioStagger = (delayChildren = 0.06, staggerChildren = 0.06): Variants => ({
  hidden: {},
  show: {
    transition: { delayChildren, staggerChildren },
  },
});

/** Enter: visible immediately (FCP). Exit-only fade for route changes. */
export const pageVariants: Variants = {
  initial: { opacity: 1, y: 0 },
  animate: { opacity: 1, y: 0 },
  exit: {
    opacity: 0,
    y: -8,
    filter: "blur(4px)",
    transition: { duration: 0.22, ease: [0.4, 0, 1, 1] },
  },
};
