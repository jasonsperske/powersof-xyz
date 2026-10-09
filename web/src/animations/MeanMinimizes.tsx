import { motion } from 'motion/react';
import {
  C,
  Label,
  NumberLine,
  Show,
  StepPlayer,
  linear,
  type Step,
} from './kit';

const data = [2, 4, 4, 6];
const colors = [C.warm, C.amber, C.teal, C.blue];
const mean = 4;
const base = 8; // Σ(x − x̄)²
const steps: Step[] = [
  {
    label: 'Choose a candidate center',
    caption:
      'The data are 2, 4, 4, and 6. Any number c could be called the center. To judge a choice, measure how far each observation lies from c.',
  },
  {
    label: 'Square the distances from c = 4',
    caption:
      'Each square has a side equal to one distance from c, so its area is that squared distance. With c = 4 (the mean) the areas are 4, 0, 0, and 4: a total of 8.',
    tex: String.raw`(2-4)^2+(4-4)^2+(4-4)^2+(6-4)^2=8`,
  },
  {
    label: 'Slide c to 5',
    caption:
      'Moving c away from the mean grows some squares and shrinks others. The total rises to 9 + 1 + 1 + 1 = 12.',
    tex: String.raw`(2-5)^2+(4-5)^2+(4-5)^2+(6-5)^2=12`,
  },
  {
    label: 'Where the extra 4 comes from',
    caption:
      'The total always splits into the spread around the mean plus a penalty n(x̄ − c)². The cross term vanishes because deviations from the mean sum to zero.',
    tex: String.raw`\sum(x_i-c)^2=\underbrace{\sum(x_i-\bar{x})^2}_{8}+\underbrace{n(\bar{x}-c)^2}_{4(4-5)^2=4}`,
  },
  {
    label: 'Slide c to 3',
    caption:
      'Moving the same distance the other way gives the same penalty: 1 + 1 + 1 + 9 = 12 = 8 + 4(4 − 3)².',
    tex: String.raw`\sum(x_i-3)^2 = 8 + 4(4-3)^2 = 12`,
  },
  {
    label: 'The mean is the unique minimum',
    caption:
      'Plot the total for every c: a parabola. The penalty n(x̄ − c)² is zero only when c = x̄, so the mean is the one center that minimizes the sum of squared distances.',
    tex: String.raw`S(c)=8+4(c-4)^2\ \text{ is smallest at } c=\bar{x}=4`,
    ms: 6000,
  },
];
const cAt = [4, 4, 5, 5, 3, 4];

const x = linear(0, 8, 70, 470);
const lineY = 92;
const side = 36; // px per unit of distance in the square tray
const tray = 300; // tray baseline
const meterX = 520;
const meterScale = 8; // px per unit of total area
const S = (c: number) => base + data.length * (mean - c) ** 2;
const curve = Array.from({ length: 41 }, (_, i) => {
  const c = 2.35 + (i / 40) * 3.3;
  return `${i ? 'L' : 'M'}${x(c).toFixed(1)},${(tray - S(c) * meterScale).toFixed(1)}`;
}).join(' ');

export default function MeanMinimizes() {
  return (
    <StepPlayer title="What the mean minimizes" steps={steps}>
      {(step) => {
        const c = cAt[step];
        const total = S(c);
        const squares = step >= 1 && step <= 4;
        let cursor = 70;
        const tiles = data.map((v, i) => {
          const s = Math.abs(v - c) * side;
          const left = cursor;
          cursor += Math.max(s, 18) + 16;
          return { i, s, left, d2: (v - c) ** 2 };
        });
        return (
          <>
            <NumberLine x={x} y={lineY} min={0} max={8} />
            <motion.g initial={false} animate={{ x: x(c) }}>
              <line
                x1={0}
                x2={0}
                y1={22}
                y2={lineY + 8}
                stroke={C.primary}
                strokeWidth={3}
              />
              <rect x={-34} y={4} width={68} height={24} rx={12} fill={C.primary} />
              <text x={0} y={22} textAnchor="middle" fontSize={15} fill="#fff" fontWeight={700}>
                c = {c}
              </text>
            </motion.g>
            {data.map((v, i) => (
              <circle
                key={i}
                cx={x(v)}
                cy={lineY - 14 - (i === 2 ? 20 : 0)}
                r={9}
                fill={colors[i]}
              />
            ))}

            <Show when={squares}>
              {tiles.map((t) => (
                <g key={t.i}>
                  <motion.rect
                    initial={false}
                    animate={{
                      x: t.left,
                      y: tray - t.s,
                      width: t.s,
                      height: t.s,
                    }}
                    fill={colors[t.i]}
                    fillOpacity={0.3}
                    stroke={colors[t.i]}
                    strokeWidth={2}
                  />
                  <Label
                    x={t.left + Math.max(t.s, 18) / 2}
                    y={tray + 22}
                    color={colors[t.i]}
                    weight={700}
                  >
                    {t.d2}
                  </Label>
                </g>
              ))}
              <line x1={60} x2={440} y1={tray} y2={tray} stroke={C.axis} strokeWidth={1.5} />
            </Show>

            <Show when={step >= 1}>
              <motion.rect
                initial={false}
                animate={{
                  y: tray - total * meterScale,
                  height: total * meterScale,
                }}
                x={meterX}
                width={36}
                fill={C.primary}
                fillOpacity={0.85}
                rx={3}
              />
              <Show when={step === 3 || step === 4}>
                <rect
                  x={meterX}
                  y={tray - total * meterScale}
                  width={36}
                  height={(total - base) * meterScale}
                  fill={C.lime}
                  stroke={C.primary}
                  strokeWidth={1.5}
                />
                <text x={meterX - 8} y={tray - (base + 2) * meterScale + 5} textAnchor="end" fontSize={14} fill={C.primary} fontWeight={700}>
                  +4
                </text>
              </Show>
              <line x1={meterX - 6} x2={meterX + 42} y1={tray} y2={tray} stroke={C.axis} strokeWidth={1.5} />
              <Label x={meterX + 18} y={tray - total * meterScale - 10} weight={700}>
                {total}
              </Label>
              <text x={meterX + 18} y={tray + 22} textAnchor="middle" fontSize={14} fill={C.muted}>
                total
              </text>
            </Show>

            <Show when={step === 5} delay={0.4}>
              <motion.path
                d={curve}
                fill="none"
                stroke={C.primary}
                strokeWidth={3}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.4, ease: 'easeInOut' }}
              />
              {[3, 4, 5].map((v) => (
                <circle
                  key={v}
                  cx={x(v)}
                  cy={tray - S(v) * meterScale}
                  r={v === mean ? 8 : 6}
                  fill={v === mean ? C.lime : C.paper}
                  stroke={C.primary}
                  strokeWidth={2.5}
                />
              ))}
              <line
                x1={x(mean)}
                x2={meterX}
                y1={tray - base * meterScale}
                y2={tray - base * meterScale}
                stroke={C.primary}
                strokeDasharray="4 4"
              />
              <text x={x(mean)} y={tray - base * meterScale + 28} textAnchor="middle" fontSize={15} fill={C.primary} fontWeight={700}>
                minimum 8 at c = 4
              </text>
              <text x={x(5) + 10} y={tray - S(5) * meterScale - 6} fontSize={14} fill={C.muted}>
                12
              </text>
              <text x={x(3) - 10} y={tray - S(3) * meterScale - 6} textAnchor="end" fontSize={14} fill={C.muted}>
                12
              </text>
            </Show>
          </>
        );
      }}
    </StepPlayer>
  );
}
