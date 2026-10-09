import { motion } from 'motion/react';
import { C, Show, StepPlayer, type Step } from './kit';

const cards = [
  { power: '10³', value: '1000', factors: '10·10·10' },
  { power: '10²', value: '100', factors: '10·10' },
  { power: '10¹', value: '10', factors: '10' },
  { power: '10⁰', value: '1', factors: 'no factors' },
  { power: '10⁻¹', value: '0.1', factors: '1 ÷ 10' },
  { power: '10⁻²', value: '0.01', factors: '1 ÷ (10·10)' },
];
const steps: Step[] = [
  {
    label: 'Start with a positive exponent',
    caption: '10³ means three factors of 10: 10 · 10 · 10 = 1000.',
    tex: String.raw`10^3=10\cdot10\cdot10=1000`,
  },
  {
    label: 'Lower the exponent by one',
    caption:
      'Removing one factor of 10 divides the value by 10. Moving one card to the right always means “÷ 10”.',
    tex: String.raw`10^2=\frac{10^3}{10}=100`,
  },
  {
    label: 'Keep dividing',
    caption: 'One factor of 10 remains: 10¹ = 10.',
    tex: String.raw`10^1=\frac{10^2}{10}=10`,
  },
  {
    label: 'The pattern forces 10⁰ = 1',
    caption:
      'Dividing once more leaves no factors of 10. The value is 10 ÷ 10 = 1, so 10⁰ = 1. The same argument works for any nonzero base.',
    tex: String.raw`a^0=\frac{a^1}{a}=1\quad(a\ne0)`,
    ms: 5500,
  },
  {
    label: 'Negative exponents are reciprocals',
    caption:
      'Continue the pattern past zero: 1 ÷ 10 = 0.1. A negative exponent means divide, not a negative number.',
    tex: String.raw`10^{-1}=\frac{1}{10}=0.1`,
  },
  {
    label: 'The full pattern',
    caption:
      'Each step right divides by 10. So 10⁻² = 1/10² = 0.01, and in general a⁻ⁿ = 1/aⁿ for a ≠ 0. Every value in the row is positive.',
    tex: String.raw`a^{-n}=\frac{1}{a^n}\qquad 10^{-2}=\frac{1}{100}=0.01`,
    ms: 6000,
  },
];

const w = 84;
const gap = 12;
const left = 18;
const top = 110;
const h = 116;
const cx = (i: number) => left + i * (w + gap) + w / 2;

export default function ExponentLadder() {
  return (
    <StepPlayer title="Why 10⁰ = 1 and 10⁻ⁿ = 1/10ⁿ" steps={steps} height={290}>
      {(step) => (
        <>
          {cards.map((card, i) => {
            const shown = i <= step;
            const zero = i === 3 && step >= 3;
            return (
              <g key={card.power}>
                <rect
                  x={cx(i) - w / 2}
                  y={top}
                  width={w}
                  height={h}
                  rx={10}
                  fill={zero ? C.lime : C.paper}
                  stroke={shown ? (i === step ? C.primary : C.axis) : C.grid}
                  strokeWidth={i === step ? 3 : 1.5}
                  strokeDasharray={shown ? undefined : '5 5'}
                />
                <motion.g
                  initial={false}
                  animate={{ opacity: shown ? 1 : 0, y: shown ? 0 : 12 }}
                  transition={{ duration: 0.6, delay: shown && i === step ? 0.5 : 0 }}
                >
                  <text x={cx(i)} y={top + 38} textAnchor="middle" fontSize={26} fill={C.ink} fontFamily="Georgia, serif">
                    {card.power}
                  </text>
                  <text x={cx(i)} y={top + 74} textAnchor="middle" fontSize={22} fill={C.primary} fontWeight={700}>
                    {card.value}
                  </text>
                  <text x={cx(i)} y={top + 100} textAnchor="middle" fontSize={13} fill={C.muted}>
                    {card.factors}
                  </text>
                </motion.g>
                {!shown && (
                  <text x={cx(i)} y={top + 66} textAnchor="middle" fontSize={26} fill={C.grid}>
                    ?
                  </text>
                )}
                {i > 0 && (
                  <Show when={shown}>
                    <motion.path
                      d={`M${cx(i - 1)},${top - 6} Q${(cx(i - 1) + cx(i)) / 2},${top - 50} ${cx(i)},${top - 8}`}
                      fill="none"
                      stroke={C.warm}
                      strokeWidth={2.5}
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.6 }}
                    />
                    <text x={(cx(i - 1) + cx(i)) / 2} y={top - 36} textAnchor="middle" fontSize={16} fill={C.warm} fontWeight={700}>
                      ÷10
                    </text>
                  </Show>
                )}
              </g>
            );
          })}
          <text x={left} y={top + h + 40} fontSize={15} fill={C.muted}>
            exponent decreases by 1 →
          </text>
          <Show when={step >= 4}>
            <text x={cx(4) - w / 2} y={top + h + 40} fontSize={15} fill={C.warm} fontWeight={700}>
              still positive values
            </text>
          </Show>
        </>
      )}
    </StepPlayer>
  );
}
