// Animation ids referenced by lesson sections. Kept free of React so content
// and tests can import it without loading the animation bundle.
export const animationIds = [
  'mean-balance',
  'mean-minimizes',
  'variance-squares',
  'z-score',
  'exponent-factors',
  'exponent-ladder',
  'equation-balance',
  'inequality-flip',
  'slope',
] as const;
export type AnimationId = (typeof animationIds)[number];
