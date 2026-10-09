import { motion } from 'motion/react';
import { C, Label, Show, StepPlayer, type Step } from './kit';

const steps: Step[] = [
  {
    label: 'An exponent counts factors',
    caption:
      '2³ means three factors of 2 multiplied together; 2² means two factors. The exponent is a count, not a multiplier: 2³ is not 2 × 3.',
    tex: String.raw`2^3=2\cdot2\cdot2,\qquad 2^2=2\cdot2`,
  },
  {
    label: 'Multiply: combine the lists',
    caption:
      'Multiplying 2³ by 2² puts both lists of factors into one product. Three factors plus two factors is five factors, so the exponents add.',
    tex: String.raw`2^3\cdot2^2=(2\cdot2\cdot2)(2\cdot2)=2^{3+2}=2^5`,
  },
  {
    label: 'Evaluate step by step',
    caption:
      'Multiply left to right. Each new factor doubles the running product: 2, 4, 8, 16, 32.',
    tex: String.raw`2^5=32`,
  },
  {
    label: 'Power of a power: repeat the list',
    caption:
      '(2³)² means two copies of the whole list 2·2·2. Two groups of three factors is six factors, so the exponents multiply.',
    tex: String.raw`(2^3)^2=2^3\cdot2^3=2^{3\cdot2}=2^6=64`,
  },
  {
    label: 'Addition does not combine lists',
    caption:
      'For 2³ + 2², evaluate each power first and then add: 8 + 4 = 12. The product rule applies to multiplication, so 2³ + 2² ≠ 2⁵.',
    tex: String.raw`2^3+2^2=8+4=12\ne2^5`,
  },
];

const size = 52;
const y = 130;
const colorA = C.blue;
const colorB = C.amber;

// Tile layout per step: [x, color, visible].
function tile(step: number, i: number): [number, string, boolean] {
  const groupB = i === 3 || i === 4;
  if (step === 0 || step === 4) {
    if (i === 5) return [400, colorA, false];
    return [groupB ? 340 + (i - 3) * 60 : 70 + i * 60, groupB ? colorB : colorA, true];
  }
  if (step === 1 || step === 2) {
    if (i === 5) return [370, colorA, false];
    return [70 + i * 64, groupB ? colorB : colorA, true];
  }
  // (2³)²: two groups of three.
  return [i < 3 ? 50 + i * 60 : 80 + i * 60 + 30, i < 3 ? colorA : C.teal, true];
}

export default function ExponentFactors() {
  return (
    <StepPlayer title="Exponents count factors" steps={steps} height={300}>
      {(step) => {
        const running = [2, 4, 8, 16, 32];
        return (
          <>
            {[0, 1, 2, 3, 4, 5].map((i) => {
              const [tx, color, visible] = tile(step, i);
              return (
                <motion.g
                  key={i}
                  initial={false}
                  animate={{ x: tx, y, opacity: visible ? 1 : 0 }}
                  transition={{ duration: 0.8, delay: step === 1 ? 0.1 * i : 0 }}
                >
                  <rect width={size} height={size} rx={8} fill={color} fillOpacity={0.15} stroke={color} strokeWidth={2.5} />
                  <text x={size / 2} y={size / 2 + 9} textAnchor="middle" fontSize={26} fill={C.ink} fontFamily="Georgia, serif">
                    2
                  </text>
                </motion.g>
              );
            })}

            <Show when={step === 0}>
              <text x={70 + 60 + size / 2} y={y - 24} textAnchor="middle" fontSize={24} fill={colorA} fontFamily="Georgia, serif">2³: 3 factors</text>
              <text x={290} y={y + 36} textAnchor="middle" fontSize={30} fill={C.ink}>·</text>
              <text x={340 + 30 + size / 2} y={y - 24} textAnchor="middle" fontSize={24} fill={colorB} fontFamily="Georgia, serif">2²: 2 factors</text>
            </Show>
            <Show when={step === 4}>
              <text x={70 + 60 + size / 2} y={y - 24} textAnchor="middle" fontSize={24} fill={colorA} fontFamily="Georgia, serif">2³ = 8</text>
              <text x={290} y={y + 36} textAnchor="middle" fontSize={30} fill={C.ink}>+</text>
              <text x={340 + 30 + size / 2} y={y - 24} textAnchor="middle" fontSize={24} fill={colorB} fontFamily="Georgia, serif">2² = 4</text>
              <text x={300} y={y + size + 60} textAnchor="middle" fontSize={24} fill={C.ink}>
                8 + 4 = 12, not 32
              </text>
            </Show>
            <Show when={step === 1 || step === 2}>
              <path d={`M70,${y + size + 14} v8 H${70 + 2 * 64 + size} v-8`} fill="none" stroke={colorA} strokeWidth={2} />
              <text x={70 + 64 + size / 2} y={y + size + 44} textAnchor="middle" fontSize={16} fill={colorA}>3 factors</text>
              <path d={`M${70 + 3 * 64},${y + size + 14} v8 H${70 + 4 * 64 + size} v-8`} fill="none" stroke={colorB} strokeWidth={2} />
              <text x={70 + 3.5 * 64 + size / 2} y={y + size + 44} textAnchor="middle" fontSize={16} fill={colorB}>2 factors</text>
              <text x={70 + 2 * 64 + size / 2} y={y - 28} textAnchor="middle" fontSize={26} fill={C.ink} fontFamily="Georgia, serif">
                2³ · 2² = 2⁵
              </text>
            </Show>
            <Show when={step === 2}>
              {running.map((v, i) => (
                <motion.g
                  key={i}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.5, duration: 0.4 }}
                >
                  <text
                    x={70 + i * 64 + size / 2}
                    y={y + size + 84}
                    textAnchor="middle"
                    fontSize={20}
                    fill={C.primary}
                    fontWeight={700}
                  >
                    {v}
                  </text>
                </motion.g>
              ))}
              <text x={62} y={y + size + 84} textAnchor="end" fontSize={14} fill={C.muted}>
                running
              </text>
              <motion.text
                x={70 + 5 * 64 + 10}
                y={y + 36}
                fontSize={26}
                fill={C.primary}
                fontWeight={700}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 3 }}
              >
                = 32
              </motion.text>
            </Show>
            <Show when={step === 3}>
              <rect x={40} y={y - 12} width={3 * 60 + 12} height={size + 24} rx={12} fill="none" stroke={colorA} strokeDasharray="6 4" />
              <rect x={280} y={y - 12} width={3 * 60 + 12} height={size + 24} rx={12} fill="none" stroke={C.teal} strokeDasharray="6 4" />
              <text x={136} y={y - 24} textAnchor="middle" fontSize={20} fill={colorA} fontFamily="Georgia, serif">copy 1: 2³</text>
              <text x={376} y={y - 24} textAnchor="middle" fontSize={20} fill={C.teal} fontFamily="Georgia, serif">copy 2: 2³</text>
              <Label x={300} y={y + size + 60} size={24} font="Georgia, serif">
                (2³)² = 2³ · 2³ = 2⁶ = 64
              </Label>
            </Show>
          </>
        );
      }}
    </StepPlayer>
  );
}
