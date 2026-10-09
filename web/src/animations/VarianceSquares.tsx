import { motion } from 'motion/react';
import {
  Arrow,
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
const mu = 4;
const sigma = Math.SQRT2;
const sample = Math.sqrt(8 / 3);
const steps: Step[] = [
  {
    label: 'Data and their mean',
    caption:
      'Treat {2, 4, 4, 6} hours as an entire population. Its mean is μ = 4 hours.',
  },
  {
    label: 'Signed deviations cancel',
    caption:
      'The deviations are −2, 0, 0, and +2. Averaging them always gives zero, so signed deviations cannot measure spread.',
    tex: String.raw`\sum (x_i-\mu) = -2+0+0+2 = 0`,
  },
  {
    label: 'Square each deviation',
    caption:
      'Squaring removes the signs. Draw each squared deviation as a square of unit cells: a deviation of 2 hours becomes a 2 × 2 square of area 4 hours².',
    tex: String.raw`(x_i-\mu)^2:\quad 4,\ 0,\ 0,\ 4`,
  },
  {
    label: 'Add the squared deviations',
    caption: 'Collect every cell. The total squared deviation is 8 hours².',
    tex: String.raw`\sum (x_i-\mu)^2 = 8`,
  },
  {
    label: 'Average: divide by N = 4',
    caption:
      'Share the 8 cells equally among the N = 4 observations. Each gets 2 hours². That average squared deviation is the population variance.',
    tex: String.raw`\sigma^2=\frac{1}{N}\sum(x_i-\mu)^2=\frac{8}{4}=2\ \text{hours}^2`,
  },
  {
    label: 'Square root restores units',
    caption:
      'Reshape each share into a true square with the same area. Its side, √2 ≈ 1.41 hours, is the standard deviation, measured in hours again. On the number line it sets the scale of variation around μ.',
    tex: String.raw`\sigma=\sqrt{\sigma^2}=\sqrt{2}\approx1.414\ \text{hours}`,
    ms: 6000,
  },
  {
    label: 'Sample: divide by n − 1 = 3',
    caption:
      'If the same four values are a sample estimating a larger population, divide by n − 1 = 3 instead. The shares grow to 8/3 hours², and s ≈ 1.63 hours. The data did not change; the purpose did.',
    tex: String.raw`s^2=\frac{8}{3}\approx2.67,\qquad s=\sqrt{8/3}\approx1.633\ \text{hours}`,
    ms: 6000,
  },
];

const x = linear(0, 8, 80, 520);
const lineY = 110;
const cell = 40;
const tray = 300;
const keys = ['a0', 'a1', 'a2', 'a3', 'b0', 'b1', 'b2', 'b3'];

function cellBox(step: number, k: number) {
  const square = k < 4 ? 0 : 1;
  const col = k % 2;
  const row = Math.floor((k % 4) / 2);
  if (step <= 3) {
    const left = square === 0 ? 80 : step === 3 ? 160 : 340;
    return {
      x: left + col * cell,
      y: tray - (row + 1) * cell,
      width: cell,
      height: cell,
    };
  }
  const g = Math.floor(k / 2);
  const r = k % 2;
  if (step === 4)
    return { x: 80 + g * 70, y: tray - (r + 1) * cell, width: cell, height: cell };
  const s = cell * sigma;
  return { x: 80 + g * 80, y: tray - (r + 1) * (s / 2), width: s, height: s / 2 };
}

export default function VarianceSquares() {
  return (
    <StepPlayer title="From squared deviations to standard deviation" steps={steps}>
      {(step) => {
        const spread = step === 6 ? sample : sigma;
        return (
          <>
            <Show when={step >= 5}>
              <motion.rect
                initial={false}
                animate={{ x: x(mu - spread), width: x(mu + spread) - x(mu - spread) }}
                y={lineY - 9}
                height={18}
                fill={C.lime}
                stroke={C.primary}
                strokeWidth={1.5}
                rx={4}
              />
              <Label x={x(mu)} y={lineY + 52} color={C.primary} weight={700} size={15}>
                {step === 6 ? 'x̄ ± s = 4 ± 1.63' : 'μ ± σ = 4 ± 1.41'}
              </Label>
            </Show>
            <NumberLine x={x} y={lineY} min={0} max={8} />
            <line x1={x(mu)} x2={x(mu)} y1={24} y2={lineY} stroke={C.primary} strokeDasharray="5 5" strokeWidth={1.5} />
            <text x={x(mu) + 8} y={30} fontSize={16} fill={C.primary} fontWeight={700}>
              μ = 4
            </text>
            {data.map((v, i) => (
              <circle key={i} cx={x(v)} cy={lineY - 14 - (i === 2 ? 20 : 0)} r={9} fill={colors[i]} />
            ))}

            <Show when={step === 1}>
              <Arrow x1={x(mu)} y1={58} x2={x(2)} y2={58} color={C.warm} />
              <Arrow x1={x(mu)} y1={58} x2={x(6)} y2={58} color={C.blue} />
              <text x={x(3)} y={50} textAnchor="middle" fontSize={16} fill={C.warm} fontWeight={700}>−2</text>
              <text x={x(5)} y={50} textAnchor="middle" fontSize={16} fill={C.blue} fontWeight={700}>+2</text>
              <text x={300} y={tray - 20} textAnchor="middle" fontSize={22} fill={C.ink}>
                −2 + 0 + 0 + 2 = 0
              </text>
            </Show>

            {keys.map((key, k) => (
              <motion.rect
                key={key}
                initial={false}
                animate={{
                  ...cellBox(step, k),
                  opacity: step >= 2 && step <= 5 ? 1 : 0,
                }}
                transition={{ duration: 0.9, delay: step === 4 ? k * 0.06 : 0 }}
                fill={k < 4 ? C.warm : C.blue}
                fillOpacity={0.35}
                stroke={k < 4 ? C.warm : C.blue}
                strokeWidth={1.5}
              />
            ))}
            <Show when={step === 2}>
              <text x={120} y={tray + 24} textAnchor="middle" fontSize={15} fill={C.warm}>(2−4)² = 4</text>
              <text x={225} y={tray + 24} textAnchor="middle" fontSize={15} fill={C.amber}>0</text>
              <text x={275} y={tray + 24} textAnchor="middle" fontSize={15} fill={C.teal}>0</text>
              <text x={380} y={tray + 24} textAnchor="middle" fontSize={15} fill={C.blue}>(6−4)² = 4</text>
            </Show>
            <Show when={step === 3}>
              <text x={160} y={tray + 24} textAnchor="middle" fontSize={16} fill={C.ink}>total: 8 hours²</text>
            </Show>
            <Show when={step === 4} delay={0.6}>
              <text x={80 + 1.5 * 70 + cell / 2} y={tray + 24} textAnchor="middle" fontSize={16} fill={C.ink}>
                8 ÷ 4 = 2 hours² each
              </text>
            </Show>
            <Show when={step === 5} delay={0.8}>
              <line x1={80} x2={80 + cell * sigma} y1={tray + 12} y2={tray + 12} stroke={C.primary} strokeWidth={2} />
              <text x={80} y={tray + 32} fontSize={15} fill={C.primary} fontWeight={700}>
                side = √2 ≈ 1.41 hours = σ
              </text>
            </Show>
            <Show when={step === 6}>
              {[0, 1, 2].map((g) => (
                <rect
                  key={g}
                  x={80 + g * 90}
                  y={tray - cell * sample}
                  width={cell * sample}
                  height={cell * sample}
                  fill={C.primary}
                  fillOpacity={0.25}
                  stroke={C.primary}
                  strokeWidth={1.5}
                />
              ))}
              <text x={80} y={tray + 24} fontSize={15} fill={C.primary} fontWeight={700}>
                8 ÷ 3 ≈ 2.67 hours² each · side = s ≈ 1.63 hours
              </text>
            </Show>
          </>
        );
      }}
    </StepPlayer>
  );
}
