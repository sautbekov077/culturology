export type Question = {
  id: number;
  section: number;
  question: string;
  options: string[];
  answer: number;
};

export type SectionMeta = {
  id: number;
  title: string;
  tag: string;
  description: string;
};

export type AnswerRecord = {
  correct: boolean;
  selected: number;
  at: number;
};

export type BestScore = {
  correct: number;
  total: number;
  at: number;
};

export type MistakeRecord = {
  count: number;
  at: number;
};

export type Progress = {
  version: 1;
  answers: Record<string, AnswerRecord>;
  best: Record<string, BestScore>;
  mistakes: Record<string, MistakeRecord>;
  sessions: number;
  lastAt: number | null;
};

export type QuizMode = 'section' | 'quick' | 'mistakes';

export type QuizItem = {
  question: Question;
  options: { text: string; original: number }[];
  correct: number;
};

export type SessionAnswer = {
  questionId: number;
  selected: number;
  selectedText: string;
  correct: boolean;
};

export type QuizResult = {
  mode: QuizMode;
  sectionId?: number;
  title: string;
  correct: number;
  total: number;
  answers: SessionAnswer[];
  at: number;
  durationMs: number;
  newBest: boolean;
};

export type QuizOutcome = Omit<QuizResult, 'newBest'>;

export type Route =
  | { name: 'home' }
  | { name: 'about' }
  | { name: 'result' }
  | { name: 'section'; sectionId: number }
  | { name: 'quiz'; mode: 'quick' }
  | { name: 'quiz'; mode: 'mistakes'; sectionId: number | null }
  | { name: 'quiz'; mode: 'section'; sectionId: number };
