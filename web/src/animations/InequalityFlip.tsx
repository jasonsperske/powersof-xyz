import { motion } from 'motion/react';
import { Arrow, C, NumberLine, Show, StepPlayer, linear, minus, type Step } from './kit';

const steps: Step[] = [
  {
    label: 'Order on the number line',
    caption: '2 < 5 because 2 lies to the left of 5.',
    tex: String.raw`2<5`,
  },
  {
    label: 'Multiply both by −1',
    caption:
      'Multiplying by −1 reflects every point across 0. The point that was on the left ends up on the right, so the order reverses: −2 > −5.',
    tex: String.raw`2<5\ \Longrightarrow\ -2>-5`,
  },
  {
    label: 'Track x through −2x',
    caption:
      'To solve −2x < 6, connect each input x (top line) to its value −2x (bottom line). The connecting lines cross: multiplying by a negative reverses order and stretches by 2.',
  },
  {
    label: 'Where is −2x < 6?',
    caption:
      'On the bottom line, −2x < 6 means every value to the left of 6. The open circle shows that 6 itself is excluded.',
    tex: String.raw`-2x<6`,
  },
  {
    label: 'Follow the lines back to x',
    caption:
      'The values to the left on the bottom come from inputs to the right on the top. Dividing by −2 flips the inequality: x > −3.',
    tex: String.raw`-2x<6\ \Longleftrightarrow\ x>\frac{6}{-2}=-3`,
  },
  {
    label: 'Test a value',
    caption:
      'Check x = 0: −2(0) = 0, and 0 < 6 is true. Zero satisfies x > −3, not x < −3, confirming the flip.',
    tex: String.raw`x=0:\quad -2(0)=0<6\ \checkmark`,
  },
];

const x1 = linear(-6, 6, 60, 540);
const y1 = 170;
const x2 = linear(-8, 8, 76, 524);
const top = 96;
const bottom = 256;
const samples = [-4, -3, -1, 0, 2];

export default function InequalityFlip() {
  return (
    <StepPlayer title="Why negative scaling flips an inequality" steps={steps}>
      {(step) => {
        const flipped = step >= 1;
        const colorFor = (t: number) =>
          step < 3 ? C.muted : -2 * t < 6 ? C.primary : -2 * t === 6 ? C.axis : C.warm;
        return (
          <>
            <Show when={step <= 1}>
              <NumberLine x={x1} y={y1} min={-6} max={6} />
              <line x1={x1(0)} x2={x1(0)} y1={70} y2={y1 + 12} stroke={C.muted} strokeDasharray="3 5" />
              <text x={300} y={52} textAnchor="middle" fontSize={30} fontFamily="Georgia, serif">
                <tspan fill={C.blue}>{flipped ? '−2' : '2'}</tspan>
                <tspan fill={C.ink}>{flipped ? ' > ' : ' < '}</tspan>
                <tspan fill={C.amber}>{flipped ? '−5' : '5'}</tspan>
              </text>
              <motion.circle initial={false} animate={{ cx: x1(flipped ? -2 : 2) }} transition={{ duration: 1.4 }} cy={y1 - 16} r={11} fill={C.blue} />
              <motion.circle initial={false} animate={{ cx: x1(flipped ? -5 : 5) }} transition={{ duration: 1.4 }} cy={y1 - 46} r={11} fill={C.amber} />
              <Show when={flipped}>
                <motion.path
                  d={`M${x1(2)},${y1 - 32} Q${x1(0)},${y1 - 66} ${x1(-2)},${y1 - 32}`}
                  fill="none" stroke={C.blue} strokeDasharray="4 4" strokeWidth={2}
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.4 }}
                />
                <motion.path
                  d={`M${x1(5)},${y1 - 62} Q${x1(0)},${y1 - 120} ${x1(-5)},${y1 - 62}`}
                  fill="none" stroke={C.amber} strokeDasharray="4 4" strokeWidth={2}
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.4 }}
                />
                <text x={x1(0)} y={y1 + 60} textAnchor="middle" fontSize={15} fill={C.muted}>
                  reflection across 0
                </text>
              </Show>
            </Show>

            <Show when={step >= 2}>
              <text x={22} y={top + 5} fontSize={18} fill={C.ink} fontFamily="Georgia, serif" fontStyle="italic">x</text>
              <text x={8} y={bottom + 5} fontSize={18} fill={C.ink} fontFamily="Georgia, serif">−2<tspan fontStyle="italic">x</tspan></text>
              <NumberLine x={x2} y={top} min={-8} max={8} labelEvery={2} />
              <NumberLine x={x2} y={bottom} min={-8} max={8} labelEvery={2} />
              {samples.map((t, i) => (
                <g key={t}>
                  <motion.line
                    x1={x2(t)} y1={top + 34} x2={x2(-2 * t)} y2={bottom - 10}
                    initial={{ pathLength: 0 }}
                    animate={{
                      pathLength: 1,
                      stroke: colorFor(t),
                      strokeWidth: step === 5 && t === 0 ? 4 : 2,
                    }}
                    transition={{ duration: 0.9, delay: step === 2 ? i * 0.25 : 0 }}
                    strokeDasharray={-2 * t === 6 ? '5 5' : undefined}
                  />
                  <circle cx={x2(t)} cy={top} r={5} fill={colorFor(t)} />
                  <circle cx={x2(-2 * t)} cy={bottom} r={5} fill={colorFor(t)} />
                </g>
              ))}
              <Show when={step >= 3}>
                <Arrow x1={x2(6) - 8} y1={bottom - 22} x2={x2(-8) - 8} y2={bottom - 22} color={C.primary} width={5} />
                <circle cx={x2(6)} cy={bottom - 22} r={7} fill={C.paper} stroke={C.primary} strokeWidth={3} />
                <text x={x2(-8)} y={bottom - 34} fontSize={17} fill={C.primary} fontWeight={700}>−2x &lt; 6</text>
              </Show>
              <Show when={step >= 4}>
                <Arrow x1={x2(-3) + 8} y1={top - 22} x2={x2(8) + 8} y2={top - 22} color={C.primary} width={5} />
                <circle cx={x2(-3)} cy={top - 22} r={7} fill={C.paper} stroke={C.primary} strokeWidth={3} />
                <text x={x2(-3) - 14} y={top - 16} textAnchor="end" fontSize={17} fill={C.primary} fontWeight={700}>x &gt; {minus(-3)}</text>
              </Show>
              <Show when={step === 5}>
                <circle cx={x2(0)} cy={top} r={10} fill="none" stroke={C.ink} strokeWidth={2} />
                <circle cx={x2(0)} cy={bottom} r={10} fill="none" stroke={C.ink} strokeWidth={2} />
                <text x={300} y={bottom + 62} textAnchor="middle" fontSize={16} fill={C.ink}>
                  x = 0 → −2(0) = 0, and 0 &lt; 6 ✓
                </text>
              </Show>
            </Show>
          </>
        );
      }}
    </StepPlayer>
  );
}
