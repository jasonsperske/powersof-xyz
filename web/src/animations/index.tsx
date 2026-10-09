import type { ComponentType } from 'react';
import type { AnimationId } from './registry';
import MeanBalance from './MeanBalance';
import MeanMinimizes from './MeanMinimizes';
import VarianceSquares from './VarianceSquares';
import ZScore from './ZScore';
import ExponentFactors from './ExponentFactors';
import ExponentLadder from './ExponentLadder';
import EquationBalance from './EquationBalance';
import InequalityFlip from './InequalityFlip';
import Slope from './Slope';

const animations: Record<AnimationId, ComponentType> = {
  'mean-balance': MeanBalance,
  'mean-minimizes': MeanMinimizes,
  'variance-squares': VarianceSquares,
  'z-score': ZScore,
  'exponent-factors': ExponentFactors,
  'exponent-ladder': ExponentLadder,
  'equation-balance': EquationBalance,
  'inequality-flip': InequalityFlip,
  slope: Slope,
};

export default function ConceptAnimation({ id }: { id: AnimationId }) {
  const Animation = animations[id];
  return <Animation />;
}
