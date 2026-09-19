import { useEffect, useId, useRef, useState } from 'react';
import { Maximize2, Minimize2, Pause, Play, RotateCcw } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

const MIN = -15;
const MAX = 24;
const landmarks = [
  { exponent: -15, name: 'The nucleus', kind: 'nucleus' },
  { exponent: -10, name: 'Atomic scale', kind: 'atom' },
  { exponent: -5, name: 'A living cell', kind: 'cell' },
  { exponent: -2, name: 'Centimeter scale', kind: 'tissue' },
  { exponent: 0, name: 'The human scale', kind: 'human' },
  { exponent: 3, name: 'A neighborhood', kind: 'city' },
  { exponent: 7, name: 'Our planet', kind: 'earth' },
  { exponent: 12, name: 'The solar neighborhood', kind: 'solar' },
  { exponent: 16, name: 'Between the stars', kind: 'stars' },
  { exponent: 21, name: 'A galaxy of stars', kind: 'galaxy' },
  { exponent: 24, name: 'The cosmic web', kind: 'cosmos' },
];
const stars = Array.from({ length: 95 }, (_, i) => ({
  x: Math.sin(i * 127.1 + 8) * 480,
  y: Math.sin(i * 311.7 + 3) * 330,
  r: 0.6 + ((i * 7) % 13) / 10,
}));

// Original diagrammatic scenes; their placement is illustrative, not a physical simulation.
function Subject({ kind }: { kind: string }) {
  if (kind === 'nucleus')
    return (
      <g>
        {Array.from({ length: 13 }, (_, i) => (
          <circle
            key={i}
            cx={Math.cos(i * 2.4) * Math.sqrt(i) * 15}
            cy={Math.sin(i * 2.4) * Math.sqrt(i) * 15}
            r="22"
            fill={i % 2 ? '#739ea9' : '#bde6ac'}
            fillOpacity=".55"
            stroke="#d4e8cb"
            strokeWidth=".8"
          />
        ))}
      </g>
    );
  if (kind === 'atom')
    return (
      <g fill="none" stroke="#a4d6c1" strokeWidth="1.2">
        <circle r="8" fill="#d6eab4" />
        {[0, 60, 120].map((a) => (
          <ellipse key={a} rx="175" ry="57" transform={`rotate(${a})`} />
        ))}
        <circle cx="175" r="4" fill="#fff" />
        <circle cy="-140" cx="-55" r="4" fill="#fff" />
      </g>
    );
  if (kind === 'cell')
    return (
      <g stroke="#9eccb0" fill="#3a796b" fillOpacity=".18">
        <path
          d="M-120-110 C-20-195 160-135 168-22 S100 165-28 141 S-211-27-120-110Z"
          strokeWidth="2"
        />
        <ellipse rx="54" ry="43" fillOpacity=".5" />
        <circle cx="13" cy="-7" r="17" fill="#c6e6a9" />
        {Array.from({ length: 13 }, (_, i) => (
          <ellipse
            key={i}
            cx={Math.cos(i * 2.4) * 110}
            cy={Math.sin(i * 2.4) * 94}
            rx="15"
            ry="6"
            transform={`rotate(${i * 19})`}
          />
        ))}
      </g>
    );
  if (kind === 'tissue')
    return (
      <g fill="none" stroke="#82b69f" strokeWidth="1.4">
        {Array.from({ length: 35 }, (_, i) => {
          const x = ((i % 7) - 3) * 64;
          const y = (Math.floor(i / 7) - 2) * 63;
          return (
            <g key={i} transform={`translate(${x} ${y})`}>
              <path d="M-31-18L0-34L31-18L31 18L0 34L-31 18Z" />
              <circle r="8" fill="#b5dc9b" fillOpacity=".35" />
            </g>
          );
        })}
      </g>
    );
  if (kind === 'human')
    return (
      <g fill="none" stroke="#a9cfaf" strokeWidth="1.3">
        <rect x="-150" y="-150" width="300" height="300" />
        {[-100, -50, 0, 50, 100].map((x) => (
          <path key={x} opacity=".2" d={`M${x}-150V150M-150 ${x}H150`} />
        ))}
        <g transform="rotate(-24)">
          <circle cy="-75" r="19" fill="#a9cfaf" fillOpacity=".35" />
          <path
            d="M-20-48Q-31-8-21 37L-30 106M20-48Q31-8 21 37L30 106M-20-44L-56 4M20-44L56 4M-21 37H21"
            strokeWidth="10"
            strokeLinecap="round"
          />
        </g>
      </g>
    );
  if (kind === 'city')
    return (
      <g fill="#65988a" fillOpacity=".17" stroke="#8db6a7" strokeWidth=".9">
        {Array.from({ length: 63 }, (_, i) => {
          const x = ((i % 9) - 4) * 49;
          const y = (Math.floor(i / 9) - 3) * 51;
          return (
            <rect
              key={i}
              x={x + 4}
              y={y + 4}
              width={25 + (i % 3) * 4}
              height={28 + (i % 4) * 2}
              rx="2"
            />
          );
        })}
        <path
          d="M-290 220Q-60 20 40-40T320-260"
          stroke="#86bbc1"
          strokeWidth="25"
          fill="none"
          opacity=".4"
        />
      </g>
    );
  if (kind === 'earth')
    return (
      <g>
        <circle r="173" fill="#163e50" stroke="#9acacf" strokeWidth="2" />
        <g stroke="#91bbc1" fill="none" opacity=".35">
          <ellipse rx="84" ry="173" />
          <ellipse rx="145" ry="173" />
          <ellipse rx="173" ry="55" />
          <ellipse rx="173" ry="120" />
          <path d="M0-173V173M-173 0H173" />
        </g>
        <g fill="#a5cbaa" opacity=".6">
          <path d="M-139-75L-111-119L-51-138L-32-108L-44-69L-77-39L-58-16L-82 14L-104-5L-112-43Z" />
          <path d="M-72 14L-31 27L-15 67L-34 109L-49 136L-68 77Z" />
          <path d="M6-94L48-131L110-111L143-77L130-40L81-51L58-20L26-49L17-6L44 28L26 91L5 75L-19 21L-8-22L-31-56Z" />
          <path d="M93 64L124 52L144 78L131 100L103 97Z" />
        </g>
      </g>
    );
  if (kind === 'solar')
    return (
      <g fill="none" stroke="#8db6b8" strokeWidth=".9">
        <circle r="12" fill="#e0dda9" stroke="none" />
        {[35, 61, 91, 135, 193, 255].map((r, i) => (
          <g key={r}>
            <ellipse rx={r} ry={r * 0.8} opacity=".45" />
            <circle
              cx={Math.cos(i * 2.1) * r}
              cy={Math.sin(i * 2.1) * r * 0.8}
              r={i < 3 ? 3 : 6}
              fill={i % 2 ? '#b7d7ca' : '#cebd8a'}
              stroke="none"
            />
          </g>
        ))}
      </g>
    );
  if (kind === 'galaxy')
    return (
      <g transform="rotate(-28) scale(1 .55)">
        {Array.from({ length: 180 }, (_, i) => {
          const t = i / 22;
          const r = 8 + i * 1.3;
          return (
            <circle
              key={i}
              cx={Math.cos(t + (i % 2) * Math.PI) * r}
              cy={Math.sin(t + (i % 2) * Math.PI) * r}
              r={1.3 + (i % 4)}
              fill={i % 3 ? '#b3cec3' : '#dee2b4'}
              opacity={0.25 + (i % 5) * 0.12}
            />
          );
        })}
        <ellipse rx="34" ry="25" fill="#d8e6bc" opacity=".3" />
        <ellipse rx="14" ry="10" fill="#f1edcd" opacity=".8" />
      </g>
    );
  if (kind === 'cosmos')
    return (
      <g>
        {stars.slice(0, 45).map((s, i) => (
          <g key={i}>
            <path
              d={`M${s.x} ${s.y}L${stars[(i + 7) % 45].x} ${stars[(i + 7) % 45].y}`}
              stroke="#7da9b5"
              strokeWidth=".6"
              opacity=".2"
            />
            <ellipse
              cx={s.x}
              cy={s.y}
              rx={s.r * 4}
              ry={s.r * 1.5}
              transform={`rotate(${i * 17} ${s.x} ${s.y})`}
              fill="#c3d5b7"
              opacity=".7"
            />
          </g>
        ))}
      </g>
    );
  return (
    <g>
      {stars.map((s, i) => (
        <g key={i}>
          <circle cx={s.x} cy={s.y} r={s.r * 2} fill="#d8e7d1" />
          {i % 11 === 0 && (
            <path
              d={`M${s.x - 9} ${s.y}h18M${s.x} ${s.y - 9}v18`}
              stroke="#b0c8cb"
              strokeWidth=".7"
            />
          )}
        </g>
      ))}
    </g>
  );
}

function Scene({
  exponent,
  expanded,
}: {
  exponent: number;
  expanded: boolean;
}) {
  const id = useId().replace(/:/g, '');
  return (
    <svg
      className="scale-svg"
      viewBox="-500 -325 1000 650"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id={id}>
          <stop stopColor="#264f57" />
          <stop offset="1" stopColor="#081923" />
        </radialGradient>
      </defs>
      <rect x="-500" y="-325" width="1000" height="650" fill={`url(#${id})`} />
      <g opacity=".24">
        {stars.map((s, i) => (
          <circle key={i} cx={s.x} cy={s.y} r={s.r / 2} fill="#d9eadd" />
        ))}
      </g>
      <g transform={`translate(${expanded ? 0 : 225} 0)`}>
        {landmarks
          .filter((l) => Math.abs(l.exponent - exponent) < 3)
          .map((l) => {
            const diff = l.exponent - exponent;
            return (
              <g
                key={l.kind}
                transform={`scale(${10 ** diff})`}
                opacity={Math.max(0, Math.min(1, (3 - Math.abs(diff)) * 0.65))}
              >
                <Subject kind={l.kind} />
              </g>
            );
          })}
        {Array.from({ length: 7 }, (_, i) => Math.floor(exponent) - 3 + i)
          .filter((n) => n >= MIN && n <= MAX)
          .map((n) => {
            const size = 320 * 10 ** (n - exponent);
            return (
              <g
                key={n}
                fill="none"
                stroke="#c7e4bb"
                strokeWidth=".8"
                opacity={Math.max(0.05, 0.38 - Math.abs(n - exponent) * 0.11)}
              >
                <rect x={-size / 2} y={-size / 2} width={size} height={size} />
                {size > 65 && size < 800 && (
                  <text
                    x={size / 2 - 8}
                    y={-size / 2 + 19}
                    textAnchor="end"
                    fill="#c7e4bb"
                    stroke="none"
                    fontFamily="monospace"
                    fontSize="12"
                  >
                    10
                    <tspan baselineShift="super" fontSize="9">
                      {n}
                    </tspan>{' '}
                    m
                  </text>
                )}
              </g>
            );
          })}
        <path
          d="M-9 0H9M0-9V9"
          stroke="#e2edcd"
          strokeWidth=".8"
          opacity=".6"
        />
      </g>
    </svg>
  );
}

export default function ScaleJourney() {
  const [exponent, setExponent] = useState(0);
  const [playing, setPlaying] = useState(
    () => !window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );
  const [nativeFull, setNativeFull] = useState(false);
  const [fallback, setFallback] = useState(false);
  const [visible, setVisible] = useState(true);
  const root = useRef<HTMLDivElement>(null);
  const expandButton = useRef<HTMLButtonElement>(null);
  const direction = useRef(1);
  const expanded = nativeFull || fallback;
  const closest = landmarks.reduce((a, b) =>
    Math.abs(a.exponent - exponent) < Math.abs(b.exponent - exponent) ? a : b,
  );
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const reduced = () => {
      if (media.matches) setPlaying(false);
    };
    const full = () => {
      const active = document.fullscreenElement === root.current;
      setNativeFull(active);
      if (!active) expandButton.current?.focus();
    };
    const visibility = () => setVisible(!document.hidden);
    document.addEventListener('fullscreenchange', full);
    document.addEventListener('visibilitychange', visibility);
    media.addEventListener('change', reduced);
    const observer = new IntersectionObserver(([entry]) =>
      setVisible(entry.isIntersecting && !document.hidden),
    );
    if (root.current) observer.observe(root.current);
    return () => {
      document.removeEventListener('fullscreenchange', full);
      document.removeEventListener('visibilitychange', visibility);
      media.removeEventListener('change', reduced);
      observer.disconnect();
    };
  }, []);
  useEffect(() => {
    if (!playing || (!visible && !expanded)) return;
    let frame = 0;
    let previous = 0;
    const tick = (now: number) => {
      if (!previous) previous = now;
      const elapsed = now - previous;
      if (elapsed >= 32) {
        previous = now;
        setExponent((value) => {
          const next =
            value + (Math.min(elapsed, 80) / 4500) * direction.current;
          if (next >= MAX) {
            direction.current = -1;
            return MAX;
          }
          if (next <= MIN) {
            direction.current = 1;
            return MIN;
          }
          return next;
        });
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [playing, visible, expanded]);
  async function toggleFullscreen() {
    if (nativeFull) {
      await document.exitFullscreen().catch(() => {});
      return;
    }
    if (fallback) {
      setFallback(false);
      return;
    }
    try {
      if (!root.current?.requestFullscreen)
        throw new Error('Use expanded view');
      await root.current.requestFullscreen();
    } catch {
      setFallback(true);
    }
  }
  function controls(full: boolean) {
    return (
      <div className="scale-controls">
        <div className="scale-readout">
          <span className="scale-power">
            10<sup>{Math.round(exponent)}</sup>
            <span> m</span>
          </span>
          <span className="scale-caption">{closest.name}</span>
        </div>
        <div className="scale-buttons">
          <button
            type="button"
            onClick={() => setPlaying((x) => !x)}
            aria-label={
              playing ? 'Pause scale animation' : 'Play scale animation'
            }
            title={playing ? 'Pause' : 'Play'}
          >
            {playing ? <Pause size={16} /> : <Play size={16} />}
          </button>
          {full && (
            <button
              type="button"
              onClick={() => {
                direction.current = 1;
                setExponent(0);
              }}
              aria-label="Return to human scale"
              title="Return to human scale"
            >
              <RotateCcw size={16} />
            </button>
          )}
          <button
            ref={full ? undefined : expandButton}
            type="button"
            onClick={() => void toggleFullscreen()}
            aria-label={
              full ? 'Exit fullscreen animation' : 'View animation fullscreen'
            }
            title={full ? 'Exit fullscreen' : 'Fullscreen'}
          >
            {full ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            <span>{full ? 'Exit' : 'Fullscreen'}</span>
          </button>
        </div>
      </div>
    );
  }
  const credit = (
    <div className="scale-credit">
      Illustrative orders of magnitude · Inspired by{' '}
      <a
        href="https://www.eamesoffice.com/the-work/powers-of-ten/"
        target="_blank"
        rel="noreferrer"
      >
        Charles & Ray Eames’ Powers of Ten ↗
      </a>
    </div>
  );
  return (
    <>
      <div
        className={'scale-journey' + (nativeFull ? ' scale-expanded' : '')}
        ref={root}
        role="group"
        aria-label="Animated comparison of subatomic and cosmic scales"
      >
        <Scene exponent={exponent} expanded={nativeFull} />
        <div className="scale-shade" />
        {nativeFull && (
          <div className="scale-heading">
            <span>POWERS OF SCALE</span>
            <h2>Each power of ten changes scale by a factor of 10.</h2>
          </div>
        )}
        {controls(nativeFull)}
        {nativeFull && credit}
      </div>
      <Dialog open={fallback} onOpenChange={setFallback}>
        <DialogContent className="scale-dialog" showCloseButton={false}>
          <DialogTitle className="sr-only">Powers of scale</DialogTitle>
          <DialogDescription className="sr-only">
            An illustrative comparison of orders of magnitude. Pause the
            animation or press Escape to return to the course.
          </DialogDescription>
          <Scene exponent={exponent} expanded />
          <div className="scale-heading">
            <span>POWERS OF SCALE</span>
            <h2>Each power of ten changes scale by a factor of 10.</h2>
          </div>
          {controls(true)}
          {credit}
        </DialogContent>
      </Dialog>
    </>
  );
}
