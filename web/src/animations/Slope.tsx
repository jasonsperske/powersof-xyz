import { motion } from 'motion/react';
import { Arrow, C, Show, StepPlayer, linear, type Step } from './kit';

const steps: Step[] = [
  {
    label: 'Two points on a line',
    caption: 'A line passes through (2, 7) and (5, 13). How steep is it, and where does it cross the y-axis?',
  },
  {
    label: 'Run: change in x',
    caption: 'Move horizontally from the first point to the second point’s x-value. The input changes by 5 − 2 = 3.',
    tex: String.raw`\Delta x = x_2-x_1 = 5-2 = 3`,
  },
  {
    label: 'Rise: change in y',
    caption: 'Then move vertically up to the second point. The output changes by 13 − 7 = 6. Use the same point order as for the run.',
    tex: String.raw`\Delta y = y_2-y_1 = 13-7 = 6`,
  },
  {
    label: 'Slope is rise per unit of run',
    caption: 'Divide: 6 ÷ 3 = 2. Split the triangle into unit steps: every 1 unit right, the line rises 2 units. That constant rate is the slope.',
    tex: String.raw`m=\frac{\Delta y}{\Delta x}=\frac{6}{3}=2`,
    ms: 5500,
  },
  {
    label: 'Walk back to x = 0',
    caption: 'Use the slope in reverse: each unit left drops 2. Two steps left from (2, 7) reach (0, 3). The output at input 0 is the intercept, b = 3.',
    tex: String.raw`b = 7 - 2\cdot 2 = 3`,
    ms: 5500,
  },
  {
    label: 'Write the rule',
    caption: 'Slope 2 and intercept 3 give y = 2x + 3. Check the second point: 2(5) + 3 = 13 ✓.',
    tex: String.raw`y = 2x+3`,
  },
];

const px = linear(0, 6, 90, 510);
const py = linear(0, 14, 310, 30);
const P = { x: 2, y: 7 };
const Q = { x: 5, y: 13 };
const stairs = (from: { x: number; y: number }, n: number, dir: 1 | -1) => {
  let d = `M${px(from.x)},${py(from.y)}`;
  for (let i = 1; i <= n; i++) {
    const xi = from.x + dir * i;
    d += ` H${px(xi)} V${py(from.y + dir * 2 * i)}`;
  }
  return d;
};

export default function Slope() {
  return (
    <StepPlayer title="Slope and intercept from two points" steps={steps}>
      {(step) => (
        <>
          {Array.from({ length: 7 }, (_, i) => (
            <g key={'x' + i}>
              <line x1={px(i)} x2={px(i)} y1={py(0)} y2={py(14)} stroke={C.grid} />
              <text x={px(i)} y={py(0) + 22} textAnchor="middle" fontSize={14} fill={C.muted}>{i}</text>
            </g>
          ))}
          {Array.from({ length: 8 }, (_, i) => (
            <g key={'y' + i}>
              <line x1={px(0)} x2={px(6)} y1={py(i * 2)} y2={py(i * 2)} stroke={C.grid} />
              <text x={px(0) - 12} y={py(i * 2) + 5} textAnchor="end" fontSize={14} fill={C.muted}>{i * 2}</text>
            </g>
          ))}
          <line x1={px(0)} x2={px(6)} y1={py(0)} y2={py(0)} stroke={C.axis} strokeWidth={2} />
          <line x1={px(0)} x2={px(0)} y1={py(0)} y2={py(14)} stroke={C.axis} strokeWidth={2} />

          <Show when={step >= 5}>
            <motion.line
              x1={px(0)} y1={py(3)} x2={px(5.5)} y2={py(14)}
              stroke={C.primary} strokeWidth={3}
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.2 }}
            />
            <text x={px(0.3)} y={py(12)} fontSize={20} fill={C.primary} fontWeight={700} fontFamily="Georgia, serif">
              y = 2x + 3
            </text>
          </Show>

          <Show when={step >= 1}>
            <Arrow x1={px(P.x)} y1={py(P.y)} x2={px(Q.x) - 4} y2={py(P.y)} color={C.blue} />
            <text x={px(3.5)} y={py(P.y) + 24} textAnchor="middle" fontSize={16} fill={C.blue} fontWeight={700}>Δx = 3</text>
          </Show>
          <Show when={step >= 2}>
            <Arrow x1={px(Q.x)} y1={py(P.y)} x2={px(Q.x)} y2={py(Q.y) + 4} color={C.warm} />
            <text x={px(Q.x) + 12} y={py(10) + 5} fontSize={16} fill={C.warm} fontWeight={700}>Δy = 6</text>
          </Show>
          <Show when={step >= 3}>
            <motion.path
              d={stairs(P, 3, 1)}
              fill="none" stroke={C.primary} strokeWidth={3} strokeLinejoin="round"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.8, ease: 'linear' }}
            />
            {step === 3 && (
              <text x={px(3) - 8} y={py(10)} textAnchor="end" fontSize={15} fill={C.primary} fontWeight={700}>
                1 right, 2 up
              </text>
            )}
          </Show>
          <Show when={step >= 4}>
            <motion.path
              d={stairs(P, 2, -1)}
              fill="none" stroke={C.primary} strokeWidth={3} strokeDasharray="6 4"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.4, ease: 'linear' }}
            />
            <circle cx={px(0)} cy={py(3)} r={9} fill={C.lime} stroke={C.primary} strokeWidth={3} />
            <text x={px(0) + 14} y={py(3) + 24} fontSize={16} fill={C.primary} fontWeight={700}>(0, 3): b = 3</text>
          </Show>

          {[P, Q].map((p) => (
            <g key={p.x}>
              <circle cx={px(p.x)} cy={py(p.y)} r={8} fill={C.ink} />
              <text x={px(p.x) - 12} y={py(p.y) - 12} textAnchor="end" fontSize={16} fill={C.ink} fontWeight={700}>
                ({p.x}, {p.y})
              </text>
            </g>
          ))}
        </>
      )}
    </StepPlayer>
  );
}
