import { useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Download,
  BookOpen,
  Network,
} from 'lucide-react';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import Home from './Home';
import {
  activities,
  concepts,
  lessons,
  courses,
  courseForLesson,
  courseForActivity,
  completedLessons,
  lessonDestination,
  reviewForActivity,
} from '../courses';
import {
  emptyRecord,
  grade,
  parseNumber,
  misconception,
  conceptEvidence,
  recommendation,
  validateAssessment,
  validateBackup,
  learningContext,
  tutorPrompt,
} from './engine';
import { loadRecord, saveRecord } from './db';
import type {
  Activity,
  Attempt,
  Draft,
  ExternalAssessment,
  RecordState,
} from './types';
type Update = (f: (r: RecordState) => RecordState) => void;
const math = (s: string) => (
  <div
    className="math"
    dangerouslySetInnerHTML={{
      __html: katex.renderToString(s, {
        displayMode: true,
        throwOnError: false,
        trust: false,
      }),
    }}
  />
);
function download(name: string, data: unknown) {
  const blob = new Blob(
    [typeof data === 'string' ? data : JSON.stringify(data, null, 2)],
    {
      type: typeof data === 'string' ? 'text/markdown' : 'application/json',
    },
  );
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
function Heading({
  label,
  title,
  children,
}: {
  label: string;
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="page-heading">
      <div>
        <p className="eyebrow">{label}</p>
        <h1>{title}</h1>
      </div>
      {children}
    </div>
  );
}
function Course({ id, record }: { id: string; record: RecordState }) {
  const course = courses.find((c) => c.id === id);
  if (!course) return <NotFound />;
  const complete = completedLessons(course, record.lessons);
  return (
    <main className="shell">
      <Heading
        label="FOUNDATIONS · LEARN / PRACTICE / TEST / REVIEW"
        title={course.subtitle}
      />
      <p className="intro">{course.description}</p>
      <div className="course-grid">
        <div>
          <section className="panel">
            <div className="section-heading">
              <h2>{course.title}</h2>
              <BookOpen />
            </div>
            <Progress
              value={(complete / course.lessonIds.length) * 100}
              aria-label={course.title + ' guides completed'}
            />
            <p className="small">
              {complete} of {course.lessonIds.length} guides marked complete ·{' '}
              {course.availability}
            </p>
          </section>
          {course.units.map((unit) => (
            <section className="panel" key={unit.title}>
              <p className="eyebrow">AVAILABLE NOW</p>
              <h2>{unit.title}</h2>
              <div className="lesson-list">
                {unit.lessonIds.map((id) => {
                  const l = lessons.find((l) => l.id === id)!;
                  return (
                    <a href={'#/lesson/' + l.id} key={l.id}>
                      <span className="number">
                        {record.lessons.includes(l.id) ? (
                          <Check size={19} />
                        ) : (
                          String(course.lessonIds.indexOf(id) + 1).padStart(
                            2,
                            '0',
                          )
                        )}
                      </span>
                      <div>
                        <h3>{l.title}</h3>
                        <p>
                          {l.minutes} min · Teaching guide and worked examples
                        </p>
                      </div>
                      <ArrowUpRight size={20} />
                    </a>
                  );
                })}
              </div>
              <div className="actions">
                <a className="button" href={'#/activity/' + unit.practiceId}>
                  Practice this unit <ArrowRight size={17} />
                </a>
                {unit.quizId && (
                  <a className="text-link" href={'#/activity/' + unit.quizId}>
                    Take the checkpoint →
                  </a>
                )}
              </div>
            </section>
          ))}
          <section className="section">
            <h2>Derivations and review</h2>
            <div className="activity-grid">
              {activities
                .filter(
                  (a) =>
                    course.activityIds.includes(a.id) &&
                    ['challenge', 'review'].includes(a.kind),
                )
                .map((a) => (
                  <a
                    className="panel activity-card"
                    key={a.id}
                    href={'#/activity/' + a.id}
                  >
                    <p className="eyebrow">{a.kind}</p>
                    <h3>{a.title}</h3>
                    <p>{a.questions.length} questions</p>
                    <ArrowRight size={19} />
                  </a>
                ))}
            </div>
          </section>
          {course.planned.length > 0 && (
            <section className="section">
              <h2>Planned topics</h2>
              <p className="intro">
                These topics are planned; their lessons are not yet published.
              </p>
              <ol className="future-list">
                {course.planned.map((title, i) => (
                  <li key={title}>
                    <span>
                      {String(i + course.units.length + 1).padStart(2, '0')}
                    </span>
                    <div>{title}</div>
                    <small>Planned</small>
                  </li>
                ))}
              </ol>
            </section>
          )}
          {course.id === 'pre-algebra' && (
            <div className="actions">
              <a className="button" href="#/course/algebra-1">
                Next course: Algebra I <ArrowRight size={17} />
              </a>
            </div>
          )}
        </div>
        <aside>
          <div className="panel">
            <p className="eyebrow">BEFORE YOU BEGIN</p>
            <h2>Check prerequisites</h2>
            <p className="intro">
              Use the diagnostic to identify prerequisite concepts that need review.
            </p>
            <a className="button" href={'#/activity/' + course.diagnosticId}>
              Take the diagnostic <ArrowRight size={17} />
            </a>
            {course.prerequisites.length > 0 && (
              <div className="section">
                <h3>Prerequisite concepts</h3>
                {course.prerequisites.map((id) => (
                  <a className="concept-link" href={'#/concept/' + id} key={id}>
                    {concepts.find((c) => c.id === id)?.title} ·{' '}
                    {conceptEvidence(record.attempts, id).status}
                  </a>
                ))}
              </div>
            )}
          </div>
          <div className="panel">
            <h3>Work through each unit</h3>
            <ol className="schedule">
              <li>Read the guides and solve each example yourself.</li>
              <li>Practice with notes, then explain the rules.</li>
              <li>Take the checkpoint without notes.</li>
              <li>Use the fresh review set after 48–72 hours.</li>
            </ol>
            <p className="small">
              No lessons are locked by a score. Written reasoning uses
              self-assessment rubrics.
            </p>
          </div>
        </aside>
      </div>
    </main>
  );
}
function LessonPage({
  id,
  record,
  update,
}: {
  id: string;
  record: RecordState;
  update: Update;
}) {
  const lesson = lessons.find((l) => l.id === id);
  if (!lesson) return <NotFound />;
  const course = courseForLesson(id)!;
  const index = course.lessonIds.indexOf(id);
  const next = lessonDestination(id);
  return (
    <main className="shell">
      <a className="back" href={'#/course/' + course.id}>
        ← {course.title}
      </a>
      <Heading
        label={`TEACHING GUIDE ${index + 1} OF ${course.lessonIds.length} · ${lesson.minutes} MINUTES`}
        title={lesson.title}
      />
      <div className="reading-layout">
        <article className="reading">
          <section
            className="panel core-ideas"
            aria-labelledby="core-ideas-heading"
          >
            <h2 id="core-ideas-heading">Core ideas</h2>
            <ul>
              {lesson.objectives.map((idea) => (
                <li key={idea}>{idea}</li>
              ))}
            </ul>
          </section>
          {lesson.sections.map((s, i) => (
            <section key={s.title}>
              <span className="eyebrow">0{i + 1}</span>
              <h2>{s.title}</h2>
              <p>{s.text}</p>
              {s.math && math(s.math)}
              {s.example && (
                <div className="example">
                  <p className="eyebrow">WORKED EXAMPLE</p>
                  <p>{s.example}</p>
                </div>
              )}
            </section>
          ))}
          <div className="panel">
            <label htmlFor="lesson-notes">
              <h3>Your notes</h3>
            </label>
            <p className="small">
              Saved on this device. Included only in full learning-context
              exports.
            </p>
            <textarea
              id="lesson-notes"
              rows={5}
              value={record.notes[id] ?? ''}
              onChange={(e) =>
                update((r) => ({
                  ...r,
                  notes: { ...r.notes, [id]: e.target.value },
                }))
              }
              placeholder="What clicked? What needs another look?"
            />
          </div>
          <div className="actions">
            <button
              className="button"
              onClick={() =>
                update((r) => ({
                  ...r,
                  lessons: r.lessons.includes(id)
                    ? r.lessons
                    : r.lessons.concat(id),
                }))
              }
            >
              {record.lessons.includes(id)
                ? '✓ Marked complete'
                : 'Mark guide complete'}
            </button>
            <a className="text-link" href={'#' + next}>
              {next.startsWith('/lesson/') ? 'Next guide' : 'Start practicing'}{' '}
              <ArrowRight size={17} />
            </a>
          </div>
        </article>
        <aside className="panel reading-aside">
          <p className="eyebrow">RELATED CONCEPTS</p>
          {lesson.concepts.map((c) => (
            <a className="concept-link" href={'#/concept/' + c} key={c}>
              {concepts.find((x) => x.id === c)?.title}
              <ArrowUpRight size={15} />
            </a>
          ))}
          <p className="small">
            Pause at each example. Solve it before reading the answer.
          </p>
        </aside>
      </div>
    </main>
  );
}
function ActivityPage({
  activity,
  record,
  update,
}: {
  activity: Activity;
  record: RecordState;
  update: Update;
}) {
  const course = courseForActivity(activity.id)!;
  const draft = record.drafts[activity.id] ?? {
    answers: {},
    hints: [],
    changes: {},
  };
  const [submitted, setSubmitted] = useState(false);
  const [rubrics, setRubrics] = useState<Record<string, number[]>>({});
  const [saved, setSaved] = useState(false);
  const [savedPercent, setSavedPercent] = useState(0);
  const [error, setError] = useState('');
  const started = useRef(Date.now());
  const change = (patch: Partial<Draft>) =>
    update((r) => ({
      ...r,
      drafts: { ...r.drafts, [activity.id]: { ...draft, ...patch } },
    }));
  const results = activity.questions.map((q) => ({
    q,
    score:
      q.kind === 'written'
        ? (rubrics[q.id]?.length ?? 0) / (q.rubric?.length ?? 1)
        : grade(q, draft.answers[q.id] ?? ''),
  }));
  const percent = Math.round(
    (results.reduce((s, x) => s + x.score, 0) / results.length) * 100,
  );
  function submit() {
    const missing = activity.questions.find(
      (q) =>
        !draft.answers[q.id]?.trim() ||
        (q.kind === 'number' && parseNumber(draft.answers[q.id]) === null),
    );
    if (missing) {
      setError(
        'Please answer every question. Numeric answers accept decimals or fractions such as 5/6. Check question ' +
          (activity.questions.indexOf(missing) + 1) +
          '.',
      );
      document.getElementById(missing.id)?.focus();
      return;
    }
    setError('');
    setSubmitted(true);
  }
  function save() {
    const now = new Date().toISOString();
    const rows: Attempt[] = results.map(({ q, score }) => ({
      id: crypto.randomUUID(),
      activityId: activity.id,
      questionId: q.id,
      concept: q.concept,
      category: q.category,
      answer: draft.answers[q.id],
      score,
      maxScore: 1,
      grading: q.kind === 'written' ? 'self' : 'automatic',
      at: now,
      hintUsed: draft.hints.includes(q.id),
      changes: draft.changes[q.id] ?? 0,
      seconds: Math.round(
        (Date.now() - started.current) / 1000 / activity.questions.length,
      ),
      misconception:
        score < 1 ? misconception(q, draft.answers[q.id]) : undefined,
    }));
    update((r) => {
      const drafts = { ...r.drafts };
      delete drafts[activity.id];
      return { ...r, attempts: [...r.attempts, ...rows], drafts };
    });
    setSavedPercent(percent);
    setSaved(true);
  }
  if (saved)
    return (
      <main className="shell narrow">
        <Heading
          label={
            activity.kind === 'diagnostic'
              ? 'DIAGNOSTIC COMPLETE'
              : 'ATTEMPT ADDED TO YOUR RECORD'
          }
          title={
            activity.kind === 'diagnostic'
              ? 'Diagnostic results recorded.'
              : `Score: ${savedPercent}%`
          }
        />
        <div className="panel">
          <h2>{activity.title}</h2>
          <p className="intro">
            {activity.kind === 'diagnostic'
              ? 'This is not a pass/fail result. Look at your concept evidence to choose which foundations to revisit.'
              : recommendation(savedPercent)}
          </p>
          <p className="small">
            {results.filter((r) => r.q.kind === 'written').length} written
            questions were self-assessed. Saves are confirmed in the status bar
            above.
          </p>
          <div className="actions">
            <a className="button" href="#/progress">
              View learning record
            </a>
            <a className="text-link" href={'#/course/' + course.id}>
              Back to course →
            </a>
          </div>
        </div>
      </main>
    );
  return (
    <main className="shell narrow">
      <a className="back" href={'#/course/' + course.id}>
        ← {course.title}
      </a>
      <Heading label={activity.kind.toUpperCase()} title={activity.title} />
      <p className="intro">{activity.description}</p>
      {submitted && (
        <div className="notice">
          <strong>Compare your reasoning.</strong> Automatic answers are checked
          below. For each written answer, select only rubric statements your
          response actually satisfies, then save the assessment. Unchecked
          criteria receive no credit.
        </div>
      )}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submitted ? save() : submit();
        }}
      >
        {activity.questions.map((q, i) => (
          <section className="question panel" key={q.id}>
            <div className="question-top">
              <span className="eyebrow">
                QUESTION {String(i + 1).padStart(2, '0')}
              </span>
              <span className="tag">{q.category}</span>
            </div>
            <label htmlFor={q.id}>
              <h3>{q.prompt}</h3>
            </label>
            {q.kind === 'choice' ? (
              <RadioGroup
                id={q.id}
                aria-label={q.prompt}
                disabled={submitted}
                value={draft.answers[q.id] ?? ''}
                onValueChange={(value) =>
                  change({
                    answers: { ...draft.answers, [q.id]: String(value) },
                    changes: {
                      ...draft.changes,
                      [q.id]: (draft.changes[q.id] ?? 0) + 1,
                    },
                  })
                }
              >
                {q.options?.map((option) => (
                  <label className="option" key={option}>
                    <RadioGroupItem value={option} />
                    {option}
                  </label>
                ))}
              </RadioGroup>
            ) : q.kind === 'written' ? (
              <textarea
                id={q.id}
                rows={4}
                value={draft.answers[q.id] ?? ''}
                disabled={submitted}
                onChange={(e) =>
                  change({
                    answers: { ...draft.answers, [q.id]: e.target.value },
                    changes: {
                      ...draft.changes,
                      [q.id]: (draft.changes[q.id] ?? 0) + 1,
                    },
                  })
                }
                placeholder="Show your reasoning…"
              />
            ) : (
              <input
                id={q.id}
                className="numeric"
                type="text"
                inputMode="text"
                autoComplete="off"
                value={draft.answers[q.id] ?? ''}
                disabled={submitted}
                onChange={(e) =>
                  change({
                    answers: { ...draft.answers, [q.id]: e.target.value },
                    changes: {
                      ...draft.changes,
                      [q.id]: (draft.changes[q.id] ?? 0) + 1,
                    },
                  })
                }
                placeholder="Your answer"
              />
            )}
            {!submitted && activity.kind !== 'quiz' && (
              <div>
                {draft.hints.includes(q.id) ? (
                  <p className="hint">{q.hint}</p>
                ) : (
                  <button
                    className="hint-button"
                    type="button"
                    onClick={() => change({ hints: [...draft.hints, q.id] })}
                  >
                    Show a hint
                  </button>
                )}
              </div>
            )}
            {submitted && (
              <div
                className={
                  'feedback ' +
                  (q.kind === 'written'
                    ? 'rubric'
                    : grade(q, draft.answers[q.id])
                      ? 'correct'
                      : 'incorrect')
                }
              >
                <strong>
                  {q.kind === 'written'
                    ? 'Model reasoning'
                    : grade(q, draft.answers[q.id])
                      ? 'Correct'
                      : 'Revisit this idea'}
                </strong>
                <p>{q.solution}</p>
                {q.rubric?.map((r, j) => (
                  <label className="rubric-row" key={r}>
                    <Checkbox
                      checked={rubrics[q.id]?.includes(j) ?? false}
                      onCheckedChange={(checked) =>
                        setRubrics((x) => ({
                          ...x,
                          [q.id]: checked
                            ? [...(x[q.id] ?? []), j]
                            : (x[q.id] ?? []).filter((v) => v !== j),
                        }))
                      }
                    />
                    <span>{r}</span>
                  </label>
                ))}
              </div>
            )}
          </section>
        ))}
        {error && (
          <p role="alert" className="error">
            {error}
          </p>
        )}
        <div className="actions">
          <button className="button" type="submit">
            {submitted
              ? 'Save assessment to learning record'
              : 'Submit and review answers'}{' '}
            <ArrowRight size={18} />
          </button>
          {submitted && (
            <span className="small">
              Current score: {percent}%
              {activity.kind === 'diagnostic' ? ' (diagnostic only)' : ''}
            </span>
          )}
        </div>
      </form>
      <p className="small section">
        Answers are saved as you work. Leaving before saving the assessment
        keeps your draft; it does not add an attempt. Time is approximate
        elapsed session time per question, including pauses. Answer changes
        count input edits, not deliberate revisions.
      </p>
    </main>
  );
}
function Explore() {
  const nodes = [
    ['Calculus', 'Limits, derivatives, integrals.', 'University core'],
    ['Linear algebra', 'Vectors, maps, spaces.', 'University core'],
    [
      'Introduction to proofs',
      'Definitions and rigorous arguments.',
      'Proof foundations',
    ],
    ['Real analysis', 'The real numbers, rigorously.', 'Advanced mathematics'],
  ];
  return (
    <main className="shell">
      <Heading label="EXPLORE MATHEMATICS" title="Courses and prerequisites" />
      <p className="intro">
        Begin with Pre-algebra, continue into Algebra I, or explore Statistics
        Week 1. Your concept evidence carries across courses.
      </p>
      <div className="map-panel">
        <div className="map-row">
          <a href="#/course/pre-algebra">Pre-algebra</a>
          <b>→</b>
          <a href="#/course/algebra-1">Algebra & functions</a>
          <b>→</b>
          <span>Calculus</span>
          <b>→</b>
          <span>Analysis</span>
        </div>
        <div className="map-row">
          <span>Basic probability</span>
          <b>→</b>
          <a href="#/course/statistics">
            Statistics <ArrowUpRight size={17} />
          </a>
          <b>→</b>
          <span>Mathematical statistics</span>
        </div>
        <div className="map-row">
          <span>Introduction to proofs</span>
          <b>→</b>
          <span>Abstract algebra</span>
          <b>→</b>
          <span>Topology</span>
        </div>
        <p className="small">
          Selected pathways, not an exhaustive prerequisite graph. Concept
          prerequisites below are used by your learning record.
        </p>
      </div>
      <div className="catalog">
        {['pre-algebra', 'algebra-1', 'statistics'].map((id) => {
          const c = courses.find((c) => c.id === id)!;
          return (
            <section className="panel" key={c.id}>
              <p className="eyebrow">AVAILABLE NOW</p>
              <h2>{c.title}</h2>
              <p>{c.availability}</p>
              <a className="text-link" href={'#/course/' + c.id}>
                Open course <ArrowRight size={17} />
              </a>
            </section>
          );
        })}
        {nodes.map(([title, desc, level]) => (
          <section className="panel" key={title}>
            <p className="eyebrow">{level}</p>
            <h2>{title}</h2>
            <p>{desc}</p>
            <span className="tag">Planned</span>
          </section>
        ))}
      </div>
      <section className="section">
        <h2>Concept prerequisites</h2>
        <div className="concept-grid">
          {concepts.map((c) => (
            <a className="panel" href={'#/concept/' + c.id} key={c.id}>
              <h3>{c.title}</h3>
              <p className="small">
                {c.prerequisites.length
                  ? 'Builds on ' +
                    c.prerequisites
                      .map((id) => concepts.find((x) => x.id === id)?.title)
                      .join(' · ')
                  : 'Starting foundation'}
              </p>
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}
function ProgressPage({ record }: { record: RecordState }) {
  const evidence = concepts.map((c) => ({
    ...c,
    ...conceptEvidence(record.attempts, c.id),
  }));
  return (
    <main className="shell">
      <Heading
        label="YOUR LEARNING RECORD"
        title="Concept mastery and assessment results"
      >
        <a className="button" href="#/exchange">
          Export & import <ArrowUpRight size={17} />
        </a>
      </Heading>
      <div className="metrics">
        <div>
          <strong>
            {evidence.filter((x) => x.status === 'Mastered').length}
          </strong>
          <p>concepts with mastery evidence</p>
        </div>
        <div>
          <strong>{record.attempts.length}</strong>
          <p>question attempts</p>
        </div>
        <div>
          <strong>{evidence.filter((x) => x.due).length}</strong>
          <p>concepts due for retrieval</p>
        </div>
      </div>
      <div className="notice">
        Mastery is a working estimate based on the five latest scores, including
        labeled self-assessments. “Mastered” requires at least three distinct
        recent questions and 90% average. It is not proof of understanding.
      </div>
      <div className="concept-grid">
        {evidence.map((c) => (
          <a className="panel" href={'#/concept/' + c.id} key={c.id}>
            <div className="section-heading">
              <span
                className={'tag ' + (c.status === 'Mastered' ? 'green' : '')}
              >
                {c.status}
              </span>
              {c.due && <span className="small">Review due</span>}
            </div>
            <h3>{c.title}</h3>
            <Progress
              value={(c.mastery ?? 0) * 100}
              aria-label={c.title + ' mastery estimate'}
            />
            <p className="small">
              {c.attempts} attempts · {c.selfAssessedAttempts} self-assessed
            </p>
          </a>
        ))}
      </div>
      <section className="section">
        <div className="section-heading">
          <h2>Recent work</h2>
          <a
            href={
              '#/activity/' +
              reviewForActivity(record.attempts.at(-1)?.activityId ?? '')
            }
          >
            Practice retrieval →
          </a>
        </div>
        {record.attempts.length === 0 ? (
          <div className="panel">
            <h3>No assessment attempts recorded.</h3>
            <p className="intro">
              Choose a course and try its diagnostic or first worksheet.
            </p>
            <a className="text-link" href="#/explore">
              Choose your course →
            </a>
          </div>
        ) : (
          <div className="attempt-list">
            {record.attempts
              .slice(-20)
              .reverse()
              .map((a) => (
                <div key={a.id}>
                  <div>
                    <a href={'#/activity/' + a.activityId}>
                      {activities.find((x) => x.id === a.activityId)?.title}
                    </a>
                    <p className="small">
                      {a.questionId} · {a.category} ·{' '}
                      {a.grading === 'self'
                        ? 'Self-assessed'
                        : 'Automatically checked'}{' '}
                      · {new Date(a.at).toLocaleDateString()}
                    </p>
                  </div>
                  <strong>{Math.round(a.score * 100)}%</strong>
                </div>
              ))}
          </div>
        )}
      </section>
      {record.external.length > 0 && (
        <section className="section">
          <h2>External assessments</h2>
          <p className="intro">
            Separate evidence reviewed and accepted by you. These do not change
            the mastery calculation.
          </p>
          {record.external.map((e) => (
            <div className="panel" key={e.id}>
              <p className="small">
                Accepted {new Date(e.at).toLocaleString()}
              </p>
              {e.assessment.assessedConcepts.map((c) => (
                <div key={c.concept}>
                  <h3>
                    {concepts.find((x) => x.id === c.concept)?.title} ·{' '}
                    {c.result}
                  </h3>
                  <p>{c.evidence.join(' ')}</p>
                </div>
              ))}
            </div>
          ))}
        </section>
      )}
    </main>
  );
}
function ConceptPage({ id, record }: { id: string; record: RecordState }) {
  const c = concepts.find((x) => x.id === id);
  if (!c) return <NotFound />;
  const e = conceptEvidence(record.attempts, id);
  return (
    <main className="shell narrow">
      <a className="back" href="#/progress">
        ← Learning record
      </a>
      <Heading label="CONCEPT" title={c.title} />
      <div className="panel">
        <span className="tag">{e.status}</span>
        <p className="intro">
          {e.attempts} attempts across {e.distinctQuestions} questions.{' '}
          {e.selfAssessedAttempts} self-assessed.
        </p>
        <p>
          First-attempt accuracy:{' '}
          {e.firstAttemptAccuracy === null
            ? 'No evidence'
            : Math.round(e.firstAttemptAccuracy * 100) + '%'}{' '}
          · Recent accuracy:{' '}
          {e.recentAccuracy === null
            ? 'No evidence'
            : Math.round(e.recentAccuracy * 100) + '%'}
        </p>
        {e.struggleTags.length > 0 && (
          <p className="intro">
            Possible misconceptions: {e.struggleTags.join(', ')}. These are
            answer-pattern clues, not diagnoses.
          </p>
        )}
        <h3>Prerequisites</h3>
        {c.prerequisites.length ? (
          c.prerequisites.map((id) => (
            <a className="concept-link" href={'#/concept/' + id} key={id}>
              {concepts.find((x) => x.id === id)?.title} ·{' '}
              {conceptEvidence(record.attempts, id).status}
            </a>
          ))
        ) : (
          <p className="intro">No prerequisites recorded.</p>
        )}
      </div>
      <section className="section">
        <h2>Learn and practice</h2>
        {lessons
          .filter((l) => l.concepts.includes(id))
          .map((l) => (
            <a className="resource" href={'#/lesson/' + l.id} key={l.id}>
              {l.title}
              <ArrowUpRight size={18} />
            </a>
          ))}
        {activities
          .filter((a) => a.questions.some((q) => q.concept === id))
          .map((a) => (
            <a className="resource" href={'#/activity/' + a.id} key={a.id}>
              {a.title}
              <ArrowUpRight size={18} />
            </a>
          ))}
        {!activities.some((a) => a.questions.some((q) => q.concept === id)) && (
          <p className="intro">
            This concept belongs to planned coursework. No lessons or exercises
            are published yet.
          </p>
        )}
      </section>
    </main>
  );
}
function Exchange({ record, update }: { record: RecordState; update: Update }) {
  const [pending, setPending] = useState<
    | { type: 'backup'; value: RecordState }
    | { type: 'assessment'; value: ExternalAssessment }
    | null
  >(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  async function read(file: File | undefined, type: 'backup' | 'assessment') {
    setError('');
    setMessage('');
    setPending(null);
    if (!file) return;
    try {
      if (file.size > 10 * 1024 * 1024)
        throw new Error('Choose a JSON file smaller than 10 MB.');
      const v = JSON.parse(await file.text());
      setPending(
        type === 'backup'
          ? { type, value: validateBackup(v) }
          : { type, value: validateAssessment(v) },
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unable to read this file.');
    }
  }
  const base = new URL('./', location.href).href;
  return (
    <main className="shell narrow">
      <Heading
        label="LEARNING DATA"
        title="Export and import learning records"
      />
      <p className="intro">
        Progress lives in this browser. Download a backup to move between
        devices or protect against cleared browser data. Nothing here sends your
        information to an AI service.
      </p>
      <Tabs defaultValue="ai">
        <TabsList className="exchange-tabs">
          <TabsTrigger value="ai">Work with an LLM</TabsTrigger>
          <TabsTrigger value="backup">Backup & restore</TabsTrigger>
        </TabsList>
        <TabsContent value="ai">
          <section className="panel">
            <h2>Curriculum and assessment evidence</h2>
            <p className="intro">
              Download your evidence and a companion prompt, then share them
              with the tutor you choose. Review exports before sharing: answers
              and notes can contain personal information.
            </p>
            <div className="export-options">
              {(['compact', 'full', 'assessment-only'] as const).map((mode) => (
                <div key={mode}>
                  <h3>
                    {mode === 'compact'
                      ? 'Compact'
                      : mode === 'full'
                        ? 'Full context'
                        : 'Assessment only'}
                  </h3>
                  <p>
                    {mode === 'compact'
                      ? 'All question evidence, objectives, and public resource links.'
                      : mode === 'full'
                        ? 'Adds complete available coursework, rubrics, solutions, and your notes.'
                        : 'Latest 30 question attempts, concept summaries, and external evidence.'}
                  </p>
                  <button
                    className="button secondary"
                    onClick={() => {
                      download(
                        'learning-context-' + mode + '.json',
                        learningContext(record, mode, base),
                      );
                      setMessage(
                        'Learning context downloaded. Download the companion prompt and schema below.',
                      );
                    }}
                  >
                    <Download size={16} /> Download JSON
                  </button>
                </div>
              ))}
            </div>
            <div className="actions">
              <button
                className="text-link"
                onClick={() => download('prompt.md', tutorPrompt)}
              >
                Download companion prompt ↓
              </button>
              <a className="text-link" href="./assessment.schema.json" download>
                Assessment schema ↓
              </a>
            </div>
            <p className="small">
              When using a local preview, exported URLs are local too. Full
              context works without live links. Published exports use the site’s
              current address.
            </p>
          </section>
          <section className="panel">
            <h2>Import an external assessment</h2>
            <p className="intro">
              Import a powersof-assessment 1.0 JSON file, review the evidence,
              then choose whether to add it. External evidence never silently
              overwrites mastery.
            </p>
            <label className="file-label">
              Choose assessment JSON
              <input
                type="file"
                accept=".json,application/json"
                onChange={(e) => {
                  void read(e.target.files?.[0], 'assessment');
                  e.target.value = '';
                }}
              />
            </label>
          </section>
        </TabsContent>
        <TabsContent value="backup">
          <section className="panel">
            <h2>Download a progress backup</h2>
            <p className="intro">
              Includes attempts, notes, drafts, completed guides, and accepted
              external assessments.
            </p>
            <button
              className="button"
              onClick={() =>
                download(
                  'powersof-progress-' +
                    new Date().toISOString().slice(0, 10) +
                    '.json',
                  record,
                )
              }
            >
              <Download size={17} /> Download progress backup
            </button>
          </section>
          <section className="panel">
            <h2>Restore a backup</h2>
            <p className="intro">
              A restore replaces this browser’s current record. Review the
              summary before confirming and download your current backup first.
            </p>
            <label className="file-label">
              Choose progress backup
              <input
                type="file"
                accept=".json,application/json"
                onChange={(e) => {
                  void read(e.target.files?.[0], 'backup');
                  e.target.value = '';
                }}
              />
            </label>
          </section>
        </TabsContent>
      </Tabs>
      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
      {message && (
        <p className="notice" role="status">
          {message}
        </p>
      )}
      {pending && (
        <section className="panel import-review">
          <p className="eyebrow">REVIEW BEFORE IMPORTING</p>
          {pending.type === 'backup' ? (
            <>
              <h2>Replace your current learning record?</h2>
              <p className="intro">
                Current: {record.attempts.length} attempts,{' '}
                {record.lessons.length} guides. Incoming:{' '}
                {pending.value.attempts.length} attempts,{' '}
                {pending.value.lessons.length} guides,{' '}
                {pending.value.external.length} external assessments.
              </p>
              <button
                className="text-link"
                onClick={() => download('powersof-before-restore.json', record)}
              >
                Download current record first ↓
              </button>
            </>
          ) : (
            <>
              <h2>{pending.value.assessedConcepts.length} concepts assessed</h2>
              {pending.value.assessedConcepts.map((c) => (
                <div className="assessment-entry" key={c.concept}>
                  <h3>
                    {concepts.find((x) => x.id === c.concept)?.title} ·{' '}
                    {c.result}
                  </h3>
                  <p>Model confidence: {Math.round(c.confidence * 100)}%</p>
                  <ul>
                    {c.evidence.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                  <p>
                    Misconception tags: {c.misconceptions.join(', ') || 'None'}
                  </p>
                </div>
              ))}
            </>
          )}
          <div className="actions">
            <button
              className="button"
              onClick={() => {
                const p = pending;
                update((r) =>
                  p.type === 'backup'
                    ? p.value
                    : {
                        ...r,
                        external: [
                          ...r.external,
                          {
                            id: crypto.randomUUID(),
                            at: new Date().toISOString(),
                            assessment: p.value,
                          },
                        ],
                      },
                );
                setPending(null);
                setMessage(
                  'Import accepted. Check the storage status above for save confirmation.',
                );
              }}
            >
              {pending.type === 'backup'
                ? 'Replace record with this backup'
                : 'Accept and add this evidence'}
            </button>
            <button
              className="button secondary"
              onClick={() => setPending(null)}
            >
              Cancel
            </button>
          </div>
        </section>
      )}
    </main>
  );
}
function NotFound() {
  return (
    <main className="shell">
      <Heading label="PAGE NOT FOUND" title="Page not found" />
      <a className="button" href="#/">
        My learning →
      </a>
    </main>
  );
}
export default function App() {
  const [record, setRecord] = useState<RecordState>(emptyRecord);
  const [route, setRoute] = useState(location.hash.slice(1) || '/');
  const [ready, setReady] = useState(false);
  const [storage, setStorage] = useState('Opening learning record…');
  const [loadFailed, setLoadFailed] = useState(false);
  const revision = useRef(0);
  const saveQueue = useRef(Promise.resolve());
  useEffect(() => {
    let active = true;
    loadRecord()
      .then((r) => {
        if (active) {
          setRecord(r);
          setReady(true);
          setStorage('Saved on this device');
        }
      })
      .catch(() => {
        if (active) {
          setReady(true);
          setLoadFailed(true);
          setStorage(
            'Storage unavailable or existing record unreadable. Changes stay in this tab; export a backup before closing.',
          );
        }
      });
    const listener = () => {
      setRoute(location.hash.slice(1) || '/');
      window.scrollTo(0, 0);
    };
    window.addEventListener('hashchange', listener);
    return () => {
      active = false;
      window.removeEventListener('hashchange', listener);
    };
  }, []);
  const update: Update = (fn) => setRecord((r) => fn(r));
  useEffect(() => {
    if (!ready || loadFailed) return;
    const n = ++revision.current;
    setStorage('Saving…');
    const timer = setTimeout(() => {
      saveQueue.current = saveQueue.current
        .catch(() => {})
        .then(() => saveRecord(record));
      saveQueue.current
        .then(() => {
          if (n === revision.current) setStorage('Saved on this device');
        })
        .catch(() =>
          setStorage(
            'Could not save. Export a backup before closing this tab.',
          ),
        );
    }, 250);
    return () => clearTimeout(timer);
  }, [record, ready, loadFailed]);
  useEffect(() => {
    if (
      !ready ||
      !(route.startsWith('/lesson/') || route.startsWith('/activity/'))
    )
      return;
    update((r) => (r.lastRoute === route ? r : { ...r, lastRoute: route }));
  }, [route, ready]);
  useEffect(() => {
    const doc = document as Document & {
      modelContext?: {
        registerTool: (
          tool: unknown,
          options: { signal: AbortSignal },
        ) => unknown;
      };
    };
    if (!doc.modelContext) return;
    const controller = new AbortController();
    try {
      Promise.resolve(
        doc.modelContext.registerTool(
          {
            name: 'navigate_learning_resource',
            title: 'Open a learning resource',
            description:
              'Navigate to an available lesson, activity, or course. Does not submit answers or change scores.',
            inputSchema: {
              type: 'object',
              properties: { path: { type: 'string' } },
              required: ['path'],
              additionalProperties: false,
            },
            annotations: { readOnlyHint: false },
            execute: async (input: unknown) => {
              const path = (input as { path?: unknown })?.path;
              const allowed = [
                '/',
                ...courses.map((c) => '/course/' + c.id),
                '/explore',
                '/progress',
                '/exchange',
                ...lessons.map((l) => '/lesson/' + l.id),
                ...activities.map((a) => '/activity/' + a.id),
                ...concepts.map((c) => '/concept/' + c.id),
              ];
              if (typeof path !== 'string' || !allowed.includes(path))
                throw new Error('Unknown learning resource.');
              location.hash = path;
              await new Promise<void>((resolve) =>
                requestAnimationFrame(() => resolve()),
              );
              return { path };
            },
          },
          { signal: controller.signal },
        ),
      ).catch(() => {});
    } catch {}
    return () => controller.abort();
  }, []);
  let content: React.ReactNode;
  const [type, id] = route.split('/').slice(1);
  if (!ready)
    content = (
      <main className="shell">
        <p role="status">Opening your learning record…</p>
      </main>
    );
  else if (route === '/')
    content = (
      <Home
        continueRoute={record.lastRoute}
        started={
          record.attempts.length > 0 ||
          record.lessons.length > 0 ||
          Object.keys(record.drafts).length > 0
        }
      />
    );
  else if (type === 'course') content = <Course id={id} record={record} />;
  else if (type === 'lesson')
    content = <LessonPage id={id} record={record} update={update} />;
  else if (type === 'activity') {
    const a = activities.find((a) => a.id === id);
    content = a ? (
      <ActivityPage key={id} activity={a} record={record} update={update} />
    ) : (
      <NotFound />
    );
  } else if (type === 'explore') content = <Explore />;
  else if (type === 'progress') content = <ProgressPage record={record} />;
  else if (type === 'concept')
    content = <ConceptPage id={id} record={record} />;
  else if (type === 'exchange')
    content = <Exchange record={record} update={update} />;
  else content = <NotFound />;
  return (
    <>
      <a
        className="skip"
        href="#main-content"
        onClick={(e) => {
          e.preventDefault();
          document.getElementById('main-content')?.focus();
        }}
      >
        Skip to content
      </a>
      <header className="topbar">
        <a className="brand" href="#/">
          powersof<span>.xyz</span>
        </a>
        <nav aria-label="Main navigation">
          <a href="#/" aria-current={route === '/' ? 'page' : undefined}>
            My learning
          </a>
          <a
            href="#/explore"
            aria-current={type === 'explore' ? 'page' : undefined}
          >
            Explore mathematics
          </a>
          <a
            href="#/progress"
            aria-current={type === 'progress' ? 'page' : undefined}
          >
            Learning record
          </a>
        </nav>
        <a className="local" href="#/exchange">
          <i />
          On this device
        </a>
      </header>
      <div className="storage-status" role="status">
        {storage}
      </div>
      <div id="main-content" tabIndex={-1}>
        {content}
      </div>
      <footer>
        <a href="#/exchange">Your data · Export & import</a>
        <span>Mathematics courses</span>
      </footer>
    </>
  );
}
