import { animate, stagger, type AnimationParams, type TargetsParam } from 'animejs'

export const fadeIn = (targets: TargetsParam, options?: Partial<AnimationParams>) =>
  animate(targets, {
    opacity: [0, 1],
    duration: 500,
    ease: 'outQuad',
    ...options,
  })

export const fadeOut = (targets: TargetsParam, options?: Partial<AnimationParams>) =>
  animate(targets, {
    opacity: [1, 0],
    duration: 500,
    ease: 'outQuad',
    ...options,
  })

export const slideInFromBottom = (targets: TargetsParam, options?: Partial<AnimationParams>) =>
  animate(targets, {
    translateY: [20, 0],
    opacity: [0, 1],
    duration: 600,
    ease: 'outExpo',
    ...options,
  })

export const slideInFromLeft = (targets: TargetsParam, options?: Partial<AnimationParams>) =>
  animate(targets, {
    translateX: [-20, 0],
    opacity: [0, 1],
    duration: 600,
    ease: 'outExpo',
    ...options,
  })

export const scaleIn = (targets: TargetsParam, options?: Partial<AnimationParams>) =>
  animate(targets, {
    scale: [0.9, 1],
    opacity: [0, 1],
    duration: 400,
    ease: 'outBack',
    ...options,
  })

export const staggerFadeIn = (targets: TargetsParam, options?: Partial<AnimationParams>) =>
  animate(targets, {
    opacity: [0, 1],
    translateY: [10, 0],
    delay: stagger(100),
    duration: 500,
    ease: 'outQuad',
    ...options,
  })
