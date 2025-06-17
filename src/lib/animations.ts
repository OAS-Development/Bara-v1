import { type Variants } from 'framer-motion'

export const pageTransition: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
}

export const slideIn: Variants = {
  initial: { x: -20, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: 20, opacity: 0 }
}

export const fadeIn: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 }
}

export const scaleIn: Variants = {
  initial: { scale: 0.95, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  exit: { scale: 0.95, opacity: 0 }
}

export const listItem: Variants = {
  initial: { opacity: 0, x: -10 },
  animate: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.05,
      duration: 0.3
    }
  }),
  exit: { opacity: 0, x: 10 }
}

export const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.05
    }
  }
}

export const spring = {
  type: 'spring',
  stiffness: 300,
  damping: 30
}

export const ease = [0.4, 0, 0.2, 1]

export const durations = {
  fast: 0.15,
  normal: 0.3,
  slow: 0.5
}

export const focusRing = 'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'

export const touchTarget = 'min-h-[44px] min-w-[44px]'

export const skeleton = {
  base: 'animate-pulse bg-gray-200 dark:bg-gray-700 rounded',
  text: 'h-4 w-full',
  heading: 'h-6 w-3/4',
  button: 'h-10 w-24',
  avatar: 'h-10 w-10 rounded-full'
}
