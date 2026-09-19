export type Category = "calculation" | "reasoning" | "interpretation" | "judgment";
export type Question = {
  id: string;
  prompt: string;
  concept: string;
  category: Category;
  kind: "number" | "choice" | "written";
  answer?: number | string;
  tolerance?: number;
  options?: string[];
  solution: string;
  hint: string;
  rubric?: string[];
  misconceptions?: Record<string, string>;
};
export type Activity = {
  id: string;
  title: string;
  description: string;
  kind: "diagnostic" | "worksheet" | "challenge" | "quiz" | "review";
  questions: Question[];
};
export type Lesson = {
  objectives: string[];
  id: string;
  title: string;
  minutes: number;
  concepts: string[];
  sections: { title: string; text: string; math?: string; example?: string }[];
};
export type Attempt = {
  id: string;
  activityId: string;
  questionId: string;
  concept: string;
  category: Category;
  answer: string;
  score: number;
  maxScore: number;
  grading: "automatic" | "self";
  at: string;
  hintUsed: boolean;
  changes: number;
  seconds: number;
  misconception?: string;
};
export type Draft = {
  answers: Record<string, string>;
  hints: string[];
  changes: Record<string, number>;
};
export type ExternalAssessment = {
  format: "powersof-assessment";
  version: "1.0";
  assessedConcepts: {
    concept: string;
    result: "developing" | "mastered" | "needs-work";
    confidence: number;
    evidence: string[];
    misconceptions: string[];
  }[];
};
export type RecordState = {
  format: "powersof-backup";
  version: 1;
  attempts: Attempt[];
  lessons: string[];
  notes: Record<string, string>;
  drafts: Record<string, Draft>;
  external: { id: string; at: string; assessment: ExternalAssessment }[];
  lastRoute: string;
};
