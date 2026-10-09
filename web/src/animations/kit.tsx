import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { AnimatePresence, MotionConfig, motion } from 'motion/react';
import {
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  RotateCcw,
} from 'lucide-react';
import katex from 'katex';

export const C = {
  ink: '#1b303b',
  muted: '#60717a',
  axis: '#8a9ba3',
  grid: '#e3e9ec',
  primary: '#2c634b',
  lime: '#c5f48b',
  warm: '#b5532a',
  amber: '#c98a22',
  teal: '#3c8a7c',
  blue: '#2f6f8f',
  paper: '#ffffff',
};
export const ease = [0.4, 0, 0.2, 1] as const;
export const minus = (v: number) => (v < 0 ? '−' : '') + Math.abs(v);
export const signed = (v: number) => (v > 0 ? '+' : '') + minus(v);
export const linear =
  (d0: number, d1: number, r0: number, r1: number) => (v: number) =>
    r0 + ((v - d0) / (d1 - d0)) * (r1 - r0);

export type Step = {
  label: string;
  caption: string;
  tex?: string;
  /** Autoplay dwell time for this step in milliseconds. */
  ms?: number;
};

export function Tex({ tex }: { tex: string }) {
  return (
    <span
      className="anim-tex"
      dangerouslySetInnerHTML={{
        __html: katex.renderToString(tex, {
          throwOnError: false,
          trust: false,
          displayMode: true,
        }),
      }}
    />
  );
}

const DEFAULT_MS = 4800;

/**
 * Plays a sequence of steps. The scene is a pure function of the step index,
 * so pausing, stepping, and jumping all land on the same state that playback
 * would reach.
 */
export function StepPlayer({
  title,
  steps,
  width = 600,
  height = 340,
  children,
}: {
  title: string;
  steps: Step[];
  width?: number;
  height?: number;
  children: (step: number) => ReactNode;
}) {
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const elapsed = useRef(0);
  const fill = useRef<HTMLSpanElement | null>(null);
  const last = steps.length - 1;
  const dwell = (i: number) => steps[i].ms ?? DEFAULT_MS;

  const go = useCallback(
    (i: number) => {
      elapsed.current = 0;
      if (fill.current) fill.current.style.transform = 'scaleX(0)';
      setStep(Math.max(0, Math.min(last, i)));
    },
    [last],
  );

  useEffect(() => {
    if (!playing) return;
    const ms = steps[step].ms ?? DEFAULT_MS;
    let prev = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      elapsed.current += now - prev;
      prev = now;
      const p = Math.min(1, elapsed.current / ms);
      if (fill.current) fill.current.style.transform = `scaleX(${p})`;
      if (p < 1) frame = requestAnimationFrame(tick);
      else if (step < last) go(step + 1);
      else setPlaying(false);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [playing, step, last, steps, go]);

  // The current segment's fill is driven imperatively by the playback loop.
  useLayoutEffect(() => {
    const ms = steps[step].ms ?? DEFAULT_MS;
    if (fill.current)
      fill.current.style.transform = `scaleX(${Math.min(1, elapsed.current / ms)})`;
  }, [step, steps]);

  const toggle = () => {
    if (!playing && step === last && elapsed.current >= dwell(last)) go(0);
    setPlaying((p) => !p);
  };
  const onKeyDown = (e: KeyboardEvent) => {
    const keys: Record<string, () => void> = {
      ArrowRight: () => go(step + 1),
      ArrowLeft: () => go(step - 1),
      Home: () => go(0),
      End: () => go(last),
    };
    if (keys[e.key]) {
      e.preventDefault();
      keys[e.key]();
    }
  };
  const current = steps[step];

  return (
    <MotionConfig reducedMotion="user" transition={{ duration: 0.8, ease }}>
      <figure className="anim">
        <div className="anim-head">
          <span className="eyebrow">ANIMATED EXPLANATION</span>
          <strong>{title}</strong>
          <span className="anim-count">
            Step {step + 1} of {steps.length}
          </span>
        </div>
        <svg
          className="anim-stage"
          viewBox={`0 0 ${width} ${height}`}
          role="img"
          aria-label={`${title}: ${current.label}`}
        >
          {children(step)}
        </svg>
        <figcaption className="anim-caption" aria-live="polite">
          <strong>{current.label}</strong>
          <p>{current.caption}</p>
          {current.tex && <Tex tex={current.tex} />}
        </figcaption>
        <div
          className="anim-controls"
          role="toolbar"
          tabIndex={-1}
          aria-label="Animation controls (arrow keys step)"
          onKeyDown={onKeyDown}
        >
          <div className="anim-buttons">
            <button
              type="button"
              className="anim-btn"
              onClick={() => go(0)}
              aria-label="Restart"
              title="Restart (Home)"
            >
              <RotateCcw size={16} />
            </button>
            <button
              type="button"
              className="anim-btn"
              onClick={() => go(step - 1)}
              disabled={step === 0}
              aria-label="Previous step"
              title="Previous step (←)"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              className="anim-btn anim-play"
              onClick={toggle}
              aria-label={playing ? 'Pause' : 'Play'}
              aria-pressed={playing}
            >
              {playing ? <Pause size={16} /> : <Play size={16} />}
              {playing ? 'Pause' : 'Play'}
            </button>
            <button
              type="button"
              className="anim-btn"
              onClick={() => go(step + 1)}
              disabled={step === last}
              aria-label="Next step"
              title="Next step (→)"
            >
              <ChevronRight size={18} />
            </button>
          </div>
          <ol className="anim-timeline" aria-label="Jump to step">
            {steps.map((s, i) => (
              <li key={s.label}>
                <button
                  type="button"
                  onClick={() => go(i)}
                  aria-label={`Step ${i + 1}: ${s.label}`}
                  aria-current={i === step ? 'step' : undefined}
                  title={s.label}
                >
                  <span
                    ref={i === step ? fill : undefined}
                    style={
                      i === step
                        ? undefined
                        : { transform: `scaleX(${i < step ? 1 : 0})` }
                    }
                  />
                </button>
              </li>
            ))}
          </ol>
        </div>
      </figure>
    </MotionConfig>
  );
}

/** Fades its children in and out as `when` changes. */
export function Show({
  when,
  children,
  delay = 0,
}: {
  when: boolean;
  children: ReactNode;
  delay?: number;
}) {
  return (
    <AnimatePresence initial={false}>
      {when && (
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.5, delay } }}
          exit={{ opacity: 0, transition: { duration: 0.3 } }}
        >
          {children}
        </motion.g>
      )}
    </AnimatePresence>
  );
}

export function Arrow({
  x1,
  y1,
  x2,
  y2,
  color = C.ink,
  width = 3,
  dashed = false,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color?: string;
  width?: number;
  dashed?: boolean;
}) {
  const id = 'arrow' + useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const visible = Math.hypot(x2 - x1, y2 - y1) > 1;
  return (
    <g>
      <defs>
        <marker
          id={id}
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="12"
          markerHeight="12"
          markerUnits="userSpaceOnUse"
          orient="auto"
        >
          <path d="M0,0 L10,5 L0,10 z" fill={color} />
        </marker>
      </defs>
      <motion.line
        initial={false}
        animate={{ x1, y1, x2, y2, opacity: visible ? 1 : 0 }}
        stroke={color}
        strokeWidth={width}
        strokeLinecap="round"
        strokeDasharray={dashed ? '6 5' : undefined}
        markerEnd={`url(#${id})`}
      />
    </g>
  );
}

export function NumberLine({
  x,
  y,
  min,
  max,
  every = 1,
  labelEvery = every,
}: {
  x: (v: number) => number;
  y: number;
  min: number;
  max: number;
  every?: number;
  labelEvery?: number;
}) {
  const ticks: number[] = [];
  for (let v = min; v <= max + 1e-9; v += every) ticks.push(+v.toFixed(6));
  return (
    <g>
      <line
        x1={x(min) - 14}
        x2={x(max) + 14}
        y1={y}
        y2={y}
        stroke={C.axis}
        strokeWidth={2}
      />
      {ticks.map((v) => (
        <g key={v}>
          <line
            x1={x(v)}
            x2={x(v)}
            y1={y - 6}
            y2={y + 6}
            stroke={C.axis}
            strokeWidth={1.5}
          />
          {Math.abs(v / labelEvery - Math.round(v / labelEvery)) < 1e-6 && (
            <text
              x={x(v)}
              y={y + 26}
              textAnchor="middle"
              fontSize={15}
              fill={C.muted}
            >
              {minus(v)}
            </text>
          )}
        </g>
      ))}
    </g>
  );
}

/** Text whose position animates between steps. */
export function Label({
  x,
  y,
  children,
  size = 16,
  color = C.ink,
  anchor = 'middle',
  weight,
  font,
}: {
  x: number;
  y: number;
  children: ReactNode;
  size?: number;
  color?: string;
  anchor?: 'start' | 'middle' | 'end';
  weight?: number;
  font?: string;
}) {
  return (
    <motion.text
      initial={false}
      animate={{ x, y }}
      textAnchor={anchor}
      fontSize={size}
      fill={color}
      fontWeight={weight}
      fontFamily={font}
    >
      {children}
    </motion.text>
  );
}
