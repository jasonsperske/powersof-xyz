import { motion } from 'motion/react';
import {
  Arrow,
  C,
  Label,
  NumberLine,
  Show,
  StepPlayer,
  linear,
  signed,
  type Step,
} from './kit';

const data = [1, 2, 9];
const mean = 4;
const colors = [C.warm, C.amber, C.blue];
const steps: Step[] = [
  {
    label: 'Three observations',
    caption:
      'The observations are 1, 2, and 9. Each block is one unit of the measured quantity, so each stack is as tall as its value.',
  },
  {
    label: 'Find the total',
    caption: 'Together the stacks hold 1 + 2 + 9 = 12 blocks.',
    tex: String.raw`\sum_{i=1}^{3} x_i = 1+2+9 = 12`,
  },
  {
    label: 'Share the total equally',
    caption:
      'Move blocks until every stack is the same height. Each of the n = 3 stacks ends with 12 ÷ 3 = 4 blocks. That shared level is the mean.',
    tex: String.raw`\bar{x}=\frac{1}{n}\sum x_i=\frac{12}{3}=4`,
  },
  {
    label: 'The mean is a balance point',
    caption:
      'Place the observations on a number line. The beam balances on a fulcrum at 4, even though no observation equals 4.',
  },
  {
    label: 'Measure signed deviations',
    caption:
      'A deviation is an observation minus the mean. Points below the mean give negative deviations; points above give positive ones.',
    tex: String.raw`x_i-\bar{x}:\quad 1-4=-3,\quad 2-4=-2,\quad 9-4=+5`,
  },
  {
    label: 'Deviations cancel',
    caption:
      'Lay the deviations end to end. −3 and −2 carry you 5 units left; +5 brings you back to where you started. The sum is exactly zero, for every dataset.',
    tex: String.raw`\sum(x_i-\bar{x}) = (-3)+(-2)+5 = 0`,
  },
];

// Scene A: unit blocks. Each block keeps a stable key so it can travel
// from its original stack to its share of the total.
const unit = 24;
const base = 290;
const stackX = [200, 300, 400];
const moves: Record<string, [number, number]> = {
  '2-4': [0, 1],
  '2-5': [0, 2],
  '2-6': [0, 3],
  '2-7': [1, 2],
  '2-8': [1, 3],
};
const blocks = data.flatMap((v, s) =>
  Array.from({ length: v }, (_, j) => {
    const key = `${s}-${j}`;
    const [fs, fj] = moves[key] ?? [s, j];
    return { key, color: colors[s], home: [s, j], share: [fs, fj] };
  }),
);

// Scene B: number line.
const x = linear(-2, 10, 60, 540);
const lineY = 230;
const laneY = [190, 160, 130];

export default function MeanBalance() {
  return (
    <StepPlayer title="The mean shares the total" steps={steps}>
      {(step) => {
        const chained = step >= 5;
        // Deviation arrows: radiate from the mean, then chain head to tail.
        let cursor = mean;
        const arrows = data.map((v, i) => {
          const d = v - mean;
          const from = chained ? cursor : mean;
          cursor = from + d;
          return { i, d, from, to: from + d };
        });
        return (
          <>
            <Show when={step <= 2}>
              {blocks.map((b) => {
                const [s, j] = step >= 2 ? b.share : b.home;
                return (
                  <motion.rect
                    key={b.key}
                    initial={false}
                    animate={{
                      x: stackX[s] - unit / 2 + 1,
                      y: base - (j + 1) * unit + 1,
                    }}
                    transition={{
                      duration: 0.9,
                      delay: step >= 2 ? (b.key in moves ? 0.15 : 0) : 0,
                    }}
                    width={unit - 2}
                    height={unit - 2}
                    rx={3}
                    fill={b.color}
                    fillOpacity={0.85}
                  />
                );
              })}
              <line
                x1={140}
                x2={460}
                y1={base}
                y2={base}
                stroke={C.axis}
                strokeWidth={2}
              />
              {data.map((v, s) => (
                <text
                  key={s}
                  x={stackX[s]}
                  y={base + 26}
                  textAnchor="middle"
                  fontSize={17}
                  fill={C.ink}
                >
                  {step >= 2 ? 4 : v}
                </text>
              ))}
              <Show when={step === 1}>
                <text x={300} y={50} textAnchor="middle" fontSize={22} fill={C.ink}>
                  1 + 2 + 9 = 12 blocks
                </text>
              </Show>
              <Show when={step === 2} delay={0.9}>
                <line
                  x1={150}
                  x2={450}
                  y1={base - 4 * unit}
                  y2={base - 4 * unit}
                  stroke={C.primary}
                  strokeWidth={2}
                  strokeDasharray="7 5"
                />
                <text
                  x={460}
                  y={base - 4 * unit + 6}
                  fontSize={18}
                  fill={C.primary}
                  fontWeight={700}
                >
                  x̄ = 4
                </text>
                <text x={300} y={50} textAnchor="middle" fontSize={22} fill={C.ink}>
                  12 ÷ 3 = 4 per stack
                </text>
              </Show>
            </Show>

            <Show when={step >= 3}>
              <line
                x1={x(-2) - 14}
                x2={x(10) + 14}
                y1={lineY}
                y2={lineY}
                stroke={C.ink}
                strokeWidth={4}
                strokeLinecap="round"
              />
              <polygon
                points={`${x(mean)},${lineY + 3} ${x(mean) - 16},${lineY + 30} ${x(mean) + 16},${lineY + 30}`}
                fill={C.primary}
              />
              <g transform="translate(0 38)">
                <NumberLine x={x} y={lineY} min={-2} max={10} />
              </g>
              {data.map((v, i) => (
                <circle
                  key={v}
                  cx={x(v)}
                  cy={lineY - 12}
                  r={10}
                  fill={colors[i]}
                />
              ))}
              <line
                x1={x(mean)}
                x2={x(mean)}
                y1={70}
                y2={lineY}
                stroke={C.primary}
                strokeWidth={1.5}
                strokeDasharray="5 5"
              />
              <text x={x(mean)} y={60} textAnchor="middle" fontSize={18} fill={C.primary} fontWeight={700}>
                x̄ = 4
              </text>
              <Show when={step >= 4}>
                {arrows.map((a) => (
                  <g key={a.i}>
                    <Arrow
                      x1={x(a.from)}
                      y1={laneY[a.i]}
                      x2={x(a.to)}
                      y2={laneY[a.i]}
                      color={colors[a.i]}
                    />
                    <Label
                      x={(x(a.from) + x(a.to)) / 2}
                      y={laneY[a.i] - 9}
                      color={colors[a.i]}
                      weight={700}
                    >
                      {signed(a.d)}
                    </Label>
                  </g>
                ))}
              </Show>
              <Show when={chained} delay={0.8}>
                <circle
                  cx={x(mean)}
                  cy={laneY[2]}
                  r={7}
                  fill={C.lime}
                  stroke={C.primary}
                  strokeWidth={2}
                />
                <text x={x(10)} y={100} textAnchor="end" fontSize={18} fill={C.ink}>
                  back to the mean: sum = 0
                </text>
              </Show>
            </Show>
          </>
        );
      }}
    </StepPlayer>
  );
}
