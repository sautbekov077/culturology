import questionsData from '../data/questions.json';
import type { Progress, Question, QuizItem } from '../types';

export const QUESTIONS = questionsData as Question[];

const QUESTION_BY_ID = new Map(QUESTIONS.map((question) => [question.id, question]));

export function getQuestionById(id: number): Question | undefined {
  return QUESTION_BY_ID.get(id);
}

export function shuffle<T>(input: readonly T[]): T[] {
  const array = [...input];
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function toQuizItem(question: Question): QuizItem {
  const options = shuffle(
    question.options.map((text, original) => ({ text, original })),
  );
  return {
    question,
    options,
    correct: options.findIndex((option) => option.original === question.answer),
  };
}

export function buildSectionQuiz(sectionId: number): QuizItem[] {
  const pool = QUESTIONS.filter((question) => question.section === sectionId);
  return shuffle(pool).map(toQuizItem);
}

export function buildQuickQuiz(count = 20): QuizItem[] {
  return shuffle(QUESTIONS).slice(0, count).map(toQuizItem);
}

export function buildMistakesQuiz(progress: Progress, sectionId?: number | null): QuizItem[] {
  const ids = Object.keys(progress.mistakes)
    .map(Number)
    .filter((id) => Number.isFinite(id))
    .filter((id) => {
      const question = QUESTION_BY_ID.get(id);
      return question ? !sectionId || question.section === sectionId : false;
    });

  const pool = ids
    .map((id) => QUESTION_BY_ID.get(id))
    .filter((question): question is Question => Boolean(question));

  return shuffle(pool).slice(0, 30).map(toQuizItem);
}
