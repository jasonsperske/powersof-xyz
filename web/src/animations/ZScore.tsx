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
const mu = 4;
const sigma = Math.SQRT2;
const steps: Step[] = [
  {
    label: 'Original measurements',
    caption:
      'The population {2, 4, 4, 6} has mean μ = 4 and standard deviation σ = √2 ≈ 1.41. The bracket marks one standard deviation on each side of the mean.',
  },
  {
    label: 'Subtract the mean',
    caption:
      'Shift every value left by 4. The center moves to 0, but the gaps between points—and the bracket width—do not change. Shifting never changes spread.',
    tex: String.raw`x-\mu:\quad -2,\ 0,\ 0,\ 2`,
  },
  {
    label: 'Divide by the standard deviation',
    caption:
      'Rescale every value by 1/σ. Points move toward 0 in proportion to their distance, and one standard deviation now spans exactly one unit.',
    tex: String.raw`z=\frac{x-\mu}{\sigma}:\quad -1.41,\ 0,\ 0,\ 1.41`,
  },
  {
    label: 'Read a z-score',
    caption:
      'Follow the observation 6 to its z-score. It lies 1.41 standard deviations above the mean. The z-score has no units; it measures position in standard deviations.',
    tex: String.raw`z=\frac{6-4}{\sqrt{2}}\approx1.41`,
  },
  {
    label: 'Shape is unchanged',
    caption:
      'Standardized values have mean 0 and standard deviation 1, but the relative spacing is identical. A skewed dataset stays skewed, so a z-score alone is not a percentile.',
    tex: String.raw`\bar{z}=0,\qquad \sigma_z=1`,
  },
];

const x = linear(-3, 7, 60, 540);
const lineY = 200;

export default function ZScore() {
  return (
    <StepPlayer title="Standardizing: shift, then rescale" steps={steps}>
      {(step) => {
        const shift = step >= 1 ? mu : 0;
        const scale = step >= 2 ? sigma : 1;
        const t = (v: number) => (v - shift) / scale;
        const center = t(mu);
        const sd = sigma / scale;
        const fmt = (v: number) => {
          const r = Math.round(v * 100) / 100;
          return (r < 0 ? '−' : '') + Math.abs(r);
        };
        return (
          <>
            <NumberLine x={x} y={lineY} min={-3} max={7} />
            <Show when={step >= 3}>
              {data.map((v, i) => (
                <g key={i} opacity={0.35}>
                  <circle cx={x(v)} cy={lineY - 14 - (i === 2 ? 20 : 0)} r={8} fill="none" stroke={colors[i]} strokeWidth={2} strokeDasharray="3 3" />
                </g>
              ))}
              <motion.path
                d={`M${x(6)},${lineY - 26} C${x(6)},${lineY - 90} ${x(t(6))},${lineY - 90} ${x(t(6))},${lineY - 26}`}
                fill="none"
                stroke={C.blue}
                strokeWidth={2}
                strokeDasharray="5 5"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1 }}
              />
              <text x={(x(6) + x(t(6))) / 2} y={lineY - 78} textAnchor="middle" fontSize={15} fill={C.blue} fontWeight={700}>
                6 → z ≈ 1.41
              </text>
            </Show>

            <motion.g initial={false} animate={{ x: x(center) }}>
              <line x1={0} x2={0} y1={70} y2={lineY} stroke={C.primary} strokeWidth={1.5} strokeDasharray="5 5" />
            </motion.g>
            <Label x={x(center)} y={60} color={C.primary} weight={700}>
              {step >= 1 ? 'mean 0' : 'μ = 4'}
            </Label>

            <motion.g initial={false} animate={{ x: x(center - sd) }}>
              <motion.path
                initial={false}
                animate={{ d: `M0,272 v12 M0,278 H${x(center + sd) - x(center - sd)} M${x(center + sd) - x(center - sd)},272 v12` }}
                stroke={C.ink}
                strokeWidth={2}
                fill="none"
              />
            </motion.g>
            <Label x={x(center)} y={304} size={15}>
              {step >= 2 ? '±1 SD = ±1 unit' : '±1 SD = ±1.41'}
            </Label>

            {data.map((v, i) => (
              <g key={i}>
                <motion.circle
                  initial={false}
                  animate={{ cx: x(t(v)), r: step === 3 && v === 6 ? 12 : 9 }}
                  cy={lineY - 14 - (i === 2 ? 20 : 0)}
                  fill={colors[i]}
                  stroke={step === 3 && v === 6 ? C.ink : 'none'}
                  strokeWidth={2}
                />
                {i !== 2 && (
                  <Label x={x(t(v))} y={lineY + 52} color={colors[i]} weight={700} size={15}>
                    {fmt(t(v))}
                  </Label>
                )}
              </g>
            ))}
            <text x={20} y={lineY + 52} fontSize={14} fill={C.muted}>
              {step >= 2 ? 'z' : step === 1 ? 'x − μ' : 'x'}
            </text>
            <Show when={step === 4}>
              <text x={300} y={334} textAnchor="middle" fontSize={16} fill={C.ink}>
                Gaps keep the same ratios: 2 : 0 : 2 → 1.41 : 0 : 1.41
              </text>
            </Show>
          </>
        );
      }}
    </StepPlayer>
  );
}
