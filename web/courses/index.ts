import {
  activities as statisticsActivities,
  concepts as statisticsConcepts,
  lessons as statisticsLessons,
  weeks,
} from "./statistics";
import { algebraActivities, algebraConcepts, algebraLessons } from "./algebra";
export type CourseDefinition = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  availability: string;
  prerequisites: string[];
  lessonIds: string[];
  activityIds: string[];
  diagnosticId: string;
  reviewId: string;
  units: { title: string; lessonIds: string[]; practiceId: string; quizId?: string }[];
  planned: string[];
};
export const courses: CourseDefinition[] = [
  {
    id: "statistics",
    title: "Statistics",
    subtitle: "Statistics, from the ground up.",
    description:
      "Learn why the methods work. Four sessions a week: learn, practice, test, and retrieve.",
    availability: "Week 1 available; Weeks 2–8 planned.",
    prerequisites: ["algebra.equations", "algebra.fractions", "probability.basic"],
    lessonIds: statisticsLessons.map((l) => l.id),
    activityIds: statisticsActivities.map((a) => a.id),
    diagnosticId: "diagnostic",
    reviewId: "review-1",
    units: [
      {
        title: "Week 1 · Data, variation & standardization",
        lessonIds: statisticsLessons.map((l) => l.id),
        practiceId: "worksheet-1",
        quizId: "quiz-1",
      },
    ],
    planned: weeks.slice(1),
  },
  {
    id: "pre-algebra",
    title: "Pre-algebra",
    subtitle: "Build confidence with numbers.",
    description:
      "Understand signed numbers, fractions, powers, and proportional reasoning before moving into algebra. Four guides, two checkpoints, and time to explain why.",
    availability: "Complete introductory module: four guides and two checkpoints.",
    prerequisites: [],
    lessonIds: ["pre-integers", "pre-fractions", "pre-powers", "pre-ratios"],
    activityIds: algebraActivities.filter((a) => a.id.startsWith("pre-")).map((a) => a.id),
    diagnosticId: "pre-diagnostic",
    reviewId: "pre-review",
    units: [
      {
        title: "01 · Signed numbers & fractions",
        lessonIds: ["pre-integers", "pre-fractions"],
        practiceId: "pre-practice-1",
        quizId: "pre-quiz-1",
      },
      {
        title: "02 · Powers & proportional reasoning",
        lessonIds: ["pre-powers", "pre-ratios"],
        practiceId: "pre-practice-2",
        quizId: "pre-quiz-2",
      },
    ],
    planned: [],
  },
  {
    id: "algebra-1",
    title: "Algebra I · First Principles",
    subtitle: "From numbers to relationships.",
    description:
      "Give quantities names, preserve equality, describe constraints, and connect inputs to outputs. An introductory algebra module, with pre-algebra as a helpful foundation.",
    availability:
      "First-principles module available; systems, polynomials, and quadratics planned.",
    prerequisites: ["algebra.signed-numbers", "algebra.fractions", "algebra.ratios"],
    lessonIds: ["alg-expressions", "alg-equations", "alg-inequalities", "alg-functions"],
    activityIds: algebraActivities.filter((a) => a.id.startsWith("alg-")).map((a) => a.id),
    diagnosticId: "alg-diagnostic",
    reviewId: "alg-review",
    units: [
      {
        title: "01 · Expressions & equations",
        lessonIds: ["alg-expressions", "alg-equations"],
        practiceId: "alg-practice-1",
        quizId: "alg-quiz-1",
      },
      {
        title: "02 · Inequalities & functions",
        lessonIds: ["alg-inequalities", "alg-functions"],
        practiceId: "alg-practice-2",
        quizId: "alg-quiz-2",
      },
    ],
    planned: [
      "Systems of linear equations",
      "Polynomials and factoring",
      "Quadratic equations and graphs",
    ],
  },
];
export const lessons = [...statisticsLessons, ...algebraLessons];
export const activities = [...statisticsActivities, ...algebraActivities];
export const concepts = [...statisticsConcepts, ...algebraConcepts];
export function courseForLesson(id: string) {
  return courses.find((c) => c.lessonIds.includes(id));
}
export function courseForActivity(id: string) {
  return courses.find((c) => c.activityIds.includes(id));
}
export function courseConcepts(course: CourseDefinition) {
  const ids = new Set(course.prerequisites);
  for (const l of lessons.filter((l) => course.lessonIds.includes(l.id)))
    for (const id of l.concepts) ids.add(id);
  for (const a of activities.filter((a) => course.activityIds.includes(a.id)))
    for (const q of a.questions) ids.add(q.concept);
  return concepts.filter((c) => ids.has(c.id));
}
export function completedLessons(course: CourseDefinition, completed: string[]) {
  return course.lessonIds.filter((id) => completed.includes(id)).length;
}
export function lessonDestination(id: string) {
  const course = courseForLesson(id);
  if (!course) return "/explore";
  const unit = course.units.find((u) => u.lessonIds.includes(id));
  if (!unit) return "/course/" + course.id;
  const i = unit.lessonIds.indexOf(id);
  return i < unit.lessonIds.length - 1
    ? "/lesson/" + unit.lessonIds[i + 1]
    : "/activity/" + unit.practiceId;
}
export function reviewForActivity(id: string) {
  return courseForActivity(id)?.reviewId ?? "pre-review";
}
