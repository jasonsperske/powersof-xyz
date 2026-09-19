import test from 'node:test';
import assert from 'node:assert/strict';
import 'fake-indexeddb/auto';
import {
  activities,
  concepts,
  lessons,
  courses,
  completedLessons,
  lessonDestination,
  courseForActivity,
  courseForLesson,
  courseConcepts,
  reviewForActivity,
} from '../courses';
import katex from 'katex';
import {
  grade,
  parseNumber,
  conceptEvidence,
  emptyRecord,
  validateAssessment,
  validateBackup,
  learningContext,
  misconception,
  recommendation,
} from '../src/engine';
import { loadRecord, saveRecord } from '../src/db';
import type { Attempt } from '../src/types';
const q = (id: string) =>
  activities.flatMap((a) => a.questions).find((q) => q.id === id)!;
function attempt(
  questionId: string,
  score = 1,
  date = '2026-09-18T12:00:00Z',
): Attempt {
  const question = q(questionId);
  return {
    id: crypto.randomUUID(),
    questionId,
    activityId: activities.find((a) =>
      a.questions.some((q) => q.id === questionId),
    )!.id,
    concept: question.concept,
    category: question.category,
    answer: String(question.answer ?? 'Written response'),
    score,
    maxScore: 1,
    grading: question.kind === 'written' ? 'self' : 'automatic',
    at: date,
    hintUsed: false,
    changes: 1,
    seconds: 30,
  };
}
test('Numeric grader accepts fractions and signs, rejects empty, nonfinite and executable text', () => {
  assert.equal(parseNumber('5/6'), 5 / 6);
  assert.equal(parseNumber(' -2.5 '), -2.5);
  for (const s of [
    '',
    ' ',
    '1/0',
    'Infinity',
    'NaN',
    '0x10',
    'alert(1)',
    '1+1',
  ])
    assert.equal(parseNumber(s), null);
  assert.equal(grade(q('d2'), '5/6'), 1);
  assert.equal(grade(q('w4'), ''), 0);
  assert.equal(grade(q('w7'), '2.667'), 1);
  assert.equal(grade(q('w7'), '2'), 0);
  assert.equal(grade(q('q5'), '-2'), 1);
  assert.throws(() => grade(q('w16'), 'anything'));
});
test('Known arithmetic and misconception tags match statistical definitions', () => {
  assert.equal(grade(q('q2'), '20/3'), 1);
  assert.equal(grade(q('q2'), '5'), 0);
  assert.equal(misconception(q('q2'), '5'), 'sample-population-confusion');
  assert.equal(grade(q('q4'), '36'), 1);
  assert.equal(grade(q('w11'), '-12'), 0);
  assert.equal(grade(q('r5'), 'No, SD is zero'), 1);
});
test('Mastery cannot be earned by repeating one question and keeps first attempts distinct', () => {
  const repeated = [attempt('w1'), attempt('w1'), attempt('w1')];
  assert.notEqual(conceptEvidence(repeated, 'stats.mean').status, 'Mastered');
  const list = [
    attempt('w1', 0, '2026-09-16T12:00:00Z'),
    attempt('w1'),
    attempt('w2'),
    attempt('w3'),
  ];
  const e = conceptEvidence(list, 'stats.mean');
  assert.equal(e.firstAttemptAccuracy, 2 / 3);
  assert.equal(e.recentAccuracy, 0.75);
  assert.equal(e.distinctQuestions, 3);
  assert.equal(
    conceptEvidence([attempt('w1'), attempt('w2'), attempt('w3')], 'stats.mean')
      .status,
    'Mastered',
  );
  assert.equal(conceptEvidence([], 'stats.mean').mastery, null);
});
test('External assessment validation rejects unknown concepts and unsafe confidence', () => {
  const valid = {
    format: 'powersof-assessment',
    version: '1.0',
    assessedConcepts: [
      {
        concept: 'stats.mean',
        result: 'developing',
        confidence: 0.8,
        evidence: ['Explained balance but missed the minimization argument.'],
        misconceptions: [],
      },
    ],
  };
  assert.equal(validateAssessment(valid).assessedConcepts.length, 1);
  for (const confidence of [-1, 1.1, NaN, Infinity, '0.9'])
    assert.throws(() =>
      validateAssessment({
        ...valid,
        assessedConcepts: [{ ...valid.assessedConcepts[0], confidence }],
      }),
    );
  assert.throws(() =>
    validateAssessment({
      ...valid,
      assessedConcepts: [{ ...valid.assessedConcepts[0], concept: 'invented' }],
    }),
  );
  assert.throws(() =>
    validateAssessment({
      ...valid,
      assessedConcepts: [valid.assessedConcepts[0], valid.assessedConcepts[0]],
    }),
  );
});
test('Backup validation protects nested drafts, attempt scores and references', () => {
  const record = emptyRecord();
  record.attempts = [attempt('w1')];
  record.notes = { mean: 'My notes' };
  record.drafts = {
    'worksheet-1': { answers: { w2: '4' }, hints: [], changes: { w2: 1 } },
  };
  assert.deepEqual(validateBackup(record), record);
  assert.throws(() => validateBackup({ ...record, version: 2 }));
  assert.throws(() =>
    validateBackup({
      ...record,
      attempts: [{ ...record.attempts[0], score: 2 }],
    }),
  );
  assert.throws(() =>
    validateBackup({
      ...record,
      drafts: { bad: { answers: {}, hints: [], changes: {} } },
    }),
  );
  assert.throws(() =>
    validateBackup({ ...record, notes: JSON.parse('{"__proto__":"invalid"}') }),
  );
  assert.throws(() =>
    validateBackup({
      ...record,
      attempts: [record.attempts[0], record.attempts[0]],
    }),
  );
});
test('Exports preserve evidence, distinguish full notes, and support project subpaths', () => {
  const record = emptyRecord();
  record.attempts = [attempt('w1')];
  record.notes = { mean: 'Private notes' };
  const compact = learningContext(
    record,
    'compact',
    'https://example.org/powersof/',
  );
  const full = learningContext(record, 'full', 'https://example.org/powersof/');
  assert.ok(!('notes' in compact));
  assert.deepEqual(full.notes, record.notes);
  assert.equal(compact.evidence.length, 1);
  assert.equal(
    compact.courses[0].manifest,
    'https://example.org/powersof/curriculum.json',
  );
  assert.match(
    compact.successfulWork[0].url,
    /\/powersof\/#\/activity\/worksheet-1$/,
  );
});
test('IndexedDB saves and reloads attempts, notes and unfinished work', async () => {
  assert.deepEqual(await loadRecord(), emptyRecord());
  const record = emptyRecord();
  record.attempts = [attempt('w1')];
  record.lessons = ['mean'];
  record.notes = { mean: 'The deviations cancel.' };
  record.drafts = {
    'quiz-1': { answers: { q1: '6' }, hints: [], changes: { q1: 1 } },
  };
  await saveRecord(record);
  assert.deepEqual(await loadRecord(), record);
  const later = { ...record, attempts: [...record.attempts, attempt('w2')] };
  await saveRecord(later);
  assert.equal((await loadRecord()).attempts.length, 2);
});
test('All course IDs and prerequisite links are valid, questions have solutions and rubrics', () => {
  const ids = new Set();
  for (const a of activities)
    for (const question of a.questions) {
      assert.ok(!ids.has(question.id));
      ids.add(question.id);
      assert.ok(concepts.some((c) => c.id === question.concept));
      assert.ok(question.solution.trim().length > 0);
      if (question.kind === 'written') assert.ok(question.rubric?.length);
      else assert.equal(grade(question, String(question.answer)), 1);
    }
  for (const c of concepts)
    for (const p of c.prerequisites)
      assert.ok(concepts.some((x) => x.id === p));
  assert.equal(lessons.length, 11);
  assert.equal(
    activities.find((a) => a.id === 'worksheet-1')?.questions.length,
    18,
  );
  assert.match(recommendation(79), /weak lesson/);
});

test('Every course resource has exactly one owner and unit links stay in the course', () => {
  for (const collection of [courses, lessons, activities, concepts])
    assert.equal(new Set(collection.map((x) => x.id)).size, collection.length);
  for (const course of courses) {
    assert.equal(
      completedLessons(
        course,
        lessons.map((l) => l.id),
      ),
      course.lessonIds.length,
    );
    assert.equal(courseForActivity(course.diagnosticId)?.id, course.id);
    assert.equal(courseForActivity(course.reviewId)?.id, course.id);
    for (const id of course.lessonIds)
      assert.equal(courseForLesson(id)?.id, course.id);
    for (const unit of course.units) {
      assert.ok(unit.lessonIds.every((id) => course.lessonIds.includes(id)));
      assert.equal(courseForActivity(unit.practiceId)?.id, course.id);
      assert.equal(courseForActivity(unit.quizId!)?.id, course.id);
    }
  }
  for (const lesson of lessons)
    assert.equal(
      courses.filter((c) => c.lessonIds.includes(lesson.id)).length,
      1,
    );
  for (const activity of activities)
    assert.equal(
      courses.filter((c) => c.activityIds.includes(activity.id)).length,
      1,
    );
  assert.equal(
    completedLessons(courses[0], ['pre-integers', 'alg-equations']),
    0,
  );
  assert.equal(lessonDestination('pre-integers'), '/lesson/pre-fractions');
  assert.equal(lessonDestination('pre-fractions'), '/activity/pre-practice-1');
  assert.equal(lessonDestination('alg-functions'), '/activity/alg-practice-2');
  assert.equal(lessonDestination('standardization'), '/activity/worksheet-1');
  assert.equal(reviewForActivity('alg-quiz-2'), 'alg-review');
});
test('Algebra answer keys handle signs, fractions, reciprocal powers, and percent bases', () => {
  const answers: Record<string, string> = {
    pw1: '-5',
    pw2: '24',
    pw3: '12',
    pw4: '12',
    pw5: '5/6',
    pw6: '7/12',
    pw7: '3/10',
    pw8: '3/2',
    pw9: '128',
    pw10: '1',
    pw11: '1/1000',
    pw12: '9',
    pw13: '12',
    pw14: '7/2',
    pw15: '60',
    pw16: '25',
    pq1: '-2',
    pq2: '10',
    pq3: '17/20',
    pq4: '3/2',
    pq6: '81',
    pq7: '1/8',
    pq8: '6',
    pq9: '56',
    pr1: '20',
    pr2: '13/24',
    pr3: '1/4',
    pr4: '35',
    pr5: '9',
    aw1: '14',
    aw4: '6',
    aw5: '11',
    aw6: '20',
    aw8: '7',
    aw11: '6',
    aw12: '-1',
    aw13: '2',
    aw14: '5',
    aq1: '29',
    aq3: '5',
    aq7: '8',
    aq8: '-2',
    ar1: '10',
    ar2: '4',
    ar4: '3',
    ar5: '7',
  };
  for (const [id, value] of Object.entries(answers))
    assert.equal(grade(q(id), value), 1, id);
  assert.equal(
    grade(q('pw11'), '0'),
    0,
    'small reciprocal powers must not accept zero',
  );
  assert.equal(grade(q('pw15'), '20'), 0);
  assert.equal(misconception(q('pw15'), '20'), 'confusing-discount-with-price');
  assert.equal(grade(q('aw9'), 'x ≤ −4'), 0);
  assert.equal(misconception(q('aw9'), 'x ≤ −4'), 'inequality-direction');
  assert.equal(grade(q('aq6'), 'x < −4'), 1);
  assert.equal(grade(q('aw15'), '{(1,2),(2,2)}'), 1);
});
test('Mixed-course backups remain valid, and shared evidence appears under relevant courses only', () => {
  const old = emptyRecord();
  old.attempts = [attempt('w1')];
  old.lessons = ['mean'];
  assert.deepEqual(validateBackup(old), old);
  const mixed = emptyRecord();
  mixed.attempts = [
    attempt('d2'),
    attempt('pd3'),
    attempt('ad2'),
    attempt('aw9'),
  ];
  mixed.lessons = ['mean', 'pre-fractions', 'alg-inequalities'];
  mixed.notes = { 'pre-fractions': 'Keep the denominator common.' };
  mixed.drafts = {
    'alg-practice-1': {
      answers: { aw1: '14' },
      changes: { aw1: 2 },
      hints: ['aw1'],
    },
  };
  assert.deepEqual(validateBackup(mixed), mixed);
  const exported = learningContext(mixed, 'full', 'https://powersof.xyz/');
  assert.equal(exported.courses.length, 3);
  for (const c of exported.courses)
    assert.equal(
      c.objectives.find((x) => x.id === 'algebra.fractions')?.attempts,
      3,
    );
  assert.equal(
    exported.courses
      .find((c) => c.id === 'statistics')
      ?.objectives.some((c) => c.id === 'algebra.inequalities'),
    false,
  );
  const pre = exported.courses.find((c) => c.id === 'pre-algebra')!;
  assert.ok(
    pre.objectives
      .flatMap((c) => c.resources.lessons)
      .every((url) => url.includes('/lesson/pre-')),
  );
  assert.ok(
    courseConcepts(courses.find((c) => c.id === 'algebra-1')!).some(
      (c) => c.id === 'algebra.functions',
    ),
  );
  assert.equal(
    validateAssessment({
      format: 'powersof-assessment',
      version: '1.0',
      assessedConcepts: [
        {
          concept: 'algebra.inequalities',
          result: 'developing',
          confidence: 0.7,
          evidence: ['Reversed the sign correctly on a fresh problem.'],
          misconceptions: [],
        },
      ],
    }).assessedConcepts.length,
    1,
  );
});
test('All lesson mathematics renders and prerequisites form an acyclic graph', () => {
  for (const lesson of lessons)
    for (const section of lesson.sections)
      if (section.math)
        assert.doesNotThrow(
          () => katex.renderToString(section.math!, { throwOnError: true }),
          lesson.id,
        );
  const visit = (id: string, path: Set<string>) => {
    assert.ok(!path.has(id), 'Cycle involving ' + id);
    const next = new Set(path).add(id);
    for (const prereq of concepts.find((c) => c.id === id)!.prerequisites)
      visit(prereq, next);
  };
  concepts.forEach((c) => visit(c.id, new Set()));
});
