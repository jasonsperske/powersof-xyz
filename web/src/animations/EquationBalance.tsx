import type { ReactNode } from 'react';
import { motion } from 'motion/react';
import { C, Show, StepPlayer, type Step } from './kit';

const steps: Step[] = [
  {
    label: 'An equation is a balance',
    caption:
      'Each x box has the same unknown weight; each small square weighs 1. The scale is level because 3x + 7 and 22 are equal.',
    tex: String.raw`3x+7=22`,
  },
  {
    label: 'Change only one side?',
    caption:
      'Remove 7 units from the left alone and the scale tips. The new statement 3x = 22 is not equivalent to the original equation.',
    tex: String.raw`3x\ \ne\ 22\quad\text{(not equivalent)}`,
  },
  {
    label: 'Subtract 7 from both sides',
    caption:
      'Removing 7 from both pans keeps them equal, so the scale levels again. This is why “move the 7 and change its sign” works.',
    tex: String.raw`3x+7-7=22-7\ \Longleftrightarrow\ 3x=15`,
  },
  {
    label: 'Divide both sides by 3',
    caption:
      'Split each pan into three equal groups. Each group on the left is one x; each group on the right is 5 units.',
    tex: String.raw`\frac{3x}{3}=\frac{15}{3}`,
  },
  {
    label: 'Keep one group from each side',
    caption:
      'One third of each side is still balanced: one x box weighs the same as 5 units.',
    tex: String.raw`x=5`,
  },
  {
    label: 'Check by substitution',
    caption:
      'Put 5 into every x box and rebuild the original equation. 3(5) + 7 = 22, so the scale balances: x = 5 is the solution.',
    tex: String.raw`3(5)+7=15+7=22\ \checkmark`,
  },
];
const equations = ['3x + 7 = 22', '3x ≠ 22', '3x = 15', '3x ÷ 3 = 15 ÷ 3', 'x = 5', '3(5) + 7 = 22 ✓'];

const pivot = { x: 300, y: 150 };
const arm = 150;
const drop = 110;
const box = 40;
const u = 18;
const pitch = 21;
const cols = [-66, 0, 66];

type Item = { x: number; y: number; visible: boolean };

function xBox(step: number, i: number): Item {
  if (step === 3 || step === 4)
    return { x: cols[i] - box / 2, y: -box, visible: step === 3 || i === 1 };
  return { x: -92 + i * 44, y: -box, visible: true };
}
function leftUnit(step: number, k: number): Item {
  const visible = step === 0 || step === 5;
  return {
    x: 40 + (k % 3) * pitch,
    y: -(Math.floor(k / 3) + 1) * pitch - (visible ? 0 : 50),
    visible,
  };
}
function rightUnit(step: number, k: number): Item {
  if (step === 3 || step === 4) {
    const g = Math.floor(k / 5);
    return {
      x: cols[g] - u / 2,
      y: -((k % 5) + 1) * pitch,
      visible: k < 15 && (step === 3 || g === 1),
    };
  }
  const removed = step >= 2 && step < 5 && k >= 15;
  return {
    x: -84 + (k % 8) * pitch,
    y: -(Math.floor(k / 8) + 1) * pitch - (removed ? 50 : 0),
    visible: !removed,
  };
}

function Piece({ item, children, delay = 0 }: { item: Item; children: ReactNode; delay?: number }) {
  return (
    <motion.g
      initial={false}
      animate={{ x: item.x, y: item.y, opacity: item.visible ? 1 : 0 }}
      transition={{ duration: 0.8, delay }}
    >
      {children}
    </motion.g>
  );
}

function Pan({ dx, dy, children }: { dx: number; dy: number; children: ReactNode }) {
  return (
    <g transform={`translate(${pivot.x + dx} ${pivot.y + drop})`}>
      <motion.g initial={false} animate={{ y: dy }} transition={{ duration: 1, delay: 0.5 }}>
        <line x1={0} y1={-drop} x2={-100} y2={0} stroke={C.grid} strokeWidth={2} />
        <line x1={0} y1={-drop} x2={100} y2={0} stroke={C.grid} strokeWidth={2} />
        <rect x={-104} y={0} width={208} height={7} rx={3} fill={C.ink} />
        {children}
      </motion.g>
    </g>
  );
}

export default function EquationBalance() {
  return (
    <StepPlayer title="Solving 3x + 7 = 22 on a balance" steps={steps}>
      {(step) => {
        const tilt = step === 1 ? 20 : 0;
        const unit = (
          <rect width={u} height={u} rx={3} fill={C.amber} fillOpacity={0.8} />
        );
        return (
          <>
            <text x={300} y={46} textAnchor="middle" fontSize={28} fill={step === 1 ? C.warm : C.ink} fontFamily="Georgia, serif">
              {equations[step]}
            </text>
            <polygon points={`${pivot.x},${pivot.y} ${pivot.x - 22},322 ${pivot.x + 22},322`} fill={C.primary} />
            <line x1={230} x2={370} y1={322} y2={322} stroke={C.ink} strokeWidth={3} />
            <motion.line
              initial={false}
              animate={{ y1: pivot.y - tilt, y2: pivot.y + tilt }}
              transition={{ duration: 1, delay: 0.5 }}
              x1={pivot.x - arm}
              x2={pivot.x + arm}
              stroke={C.ink}
              strokeWidth={6}
              strokeLinecap="round"
            />
            <circle cx={pivot.x} cy={pivot.y} r={6} fill={C.paper} stroke={C.ink} strokeWidth={2} />

            <Pan dx={-arm} dy={-tilt}>
              {[0, 1, 2].map((i) => (
                <Piece key={i} item={xBox(step, i)}>
                  <rect width={box} height={box} rx={6} fill={C.blue} fillOpacity={0.2} stroke={C.blue} strokeWidth={2.5} />
                  <text x={box / 2} y={box / 2 + 8} textAnchor="middle" fontSize={22} fill={C.blue} fontFamily="Georgia, serif" fontStyle={step === 5 ? 'normal' : 'italic'}>
                    {step === 5 ? 5 : 'x'}
                  </text>
                </Piece>
              ))}
              {Array.from({ length: 7 }, (_, k) => (
                <Piece key={k} item={leftUnit(step, k)} delay={k * 0.03}>
                  {unit}
                </Piece>
              ))}
              <Show when={step === 3}>
                {[-33, 33].map((sx) => (
                  <line key={sx} x1={sx} x2={sx} y1={-2} y2={-112} stroke={C.muted} strokeDasharray="4 4" />
                ))}
              </Show>
            </Pan>
            <Pan dx={arm} dy={tilt}>
              {Array.from({ length: 22 }, (_, k) => (
                <Piece key={k} item={rightUnit(step, k)} delay={step === 3 ? k * 0.03 : 0}>
                  {unit}
                </Piece>
              ))}
              <Show when={step === 3}>
                {[-33, 33].map((sx) => (
                  <line key={sx} x1={sx} x2={sx} y1={-2} y2={-112} stroke={C.muted} strokeDasharray="4 4" />
                ))}
              </Show>
            </Pan>
          </>
        );
      }}
    </StepPlayer>
  );
}
