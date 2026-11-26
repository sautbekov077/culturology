import type { Progress, QuizResult } from '../types';

const PROGRESS_KEY = 'cult.progress.v1';
const RESULT_KEY = 'cult.last-result.v1';
const IOS_HINT_KEY = 'cult.ios-hint.v1';

export function emptyProgress(): Progress {
  return {
    version: 1,
    answers: {},
    best: {},
    mistakes: {},
    sessions: 0,
    lastAt: null,
  };
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function loadProgress(): Progress {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    if (!raw) return emptyProgress();
    const parsed: unknown = JSON.parse(raw);
    if (!isObject(parsed)) return emptyProgress();
    return {
      version: 1,
      answers: isObject(parsed.answers) ? (parsed.answers as Progress['answers']) : {},
      best: isObject(parsed.best) ? (parsed.best as Progress['best']) : {},
      mistakes: isObject(parsed.mistakes) ? (parsed.mistakes as Progress['mistakes']) : {},
      sessions: typeof parsed.sessions === 'number' ? parsed.sessions : 0,
      lastAt: typeof parsed.lastAt === 'number' ? parsed.lastAt : null,
    };
  } catch {
    return emptyProgress();
  }
}

export function saveProgress(progress: Progress): void {
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  } catch {
    // Приватный режим или переполнение хранилища — приложение продолжает работать.
  }
}

export function saveLastResult(result: QuizResult | null): void {
  try {
    if (result) sessionStorage.setItem(RESULT_KEY, JSON.stringify(result));
    else sessionStorage.removeItem(RESULT_KEY);
  } catch {
    // ignore
  }
}

export function loadLastResult(): QuizResult | null {
  try {
    const raw = sessionStorage.getItem(RESULT_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (!isObject(parsed) || typeof parsed.total !== 'number' || !Array.isArray(parsed.answers)) {
      return null;
    }
    return parsed as QuizResult;
  } catch {
    return null;
  }
}

export function isIosHintDismissed(): boolean {
  try {
    return localStorage.getItem(IOS_HINT_KEY) === '1';
  } catch {
    return false;
  }
}

export function dismissIosHint(): void {
  try {
    localStorage.setItem(IOS_HINT_KEY, '1');
  } catch {
    // ignore
  }
}

export function clearAllProgress(): void {
  try {
    localStorage.removeItem(PROGRESS_KEY);
    sessionStorage.removeItem(RESULT_KEY);
  } catch {
    // ignore
  }
}

export type OverallStats = {
  answered: number;
  correct: number;
  accuracy: number;
  mistakes: number;
};

export function overallStats(progress: Progress): OverallStats {
  const records = Object.values(progress.answers);
  const answered = records.length;
  const correct = records.filter((record) => record.correct).length;
  return {
    answered,
    correct,
    accuracy: answered === 0 ? 0 : Math.round((correct / answered) * 100),
    mistakes: Object.keys(progress.mistakes).length,
  };
}

export type SectionStats = {
  answered: number;
  correct: number;
  mistakes: number;
  best: Progress['best'][string] | undefined;
};

export function sectionStats(progress: Progress, sectionId: number): SectionStats {
  const from = (sectionId - 1) * 30 + 1;
  const to = sectionId * 30;
  let answered = 0;
  let correct = 0;
  let mistakes = 0;
  for (let id = from; id <= to; id += 1) {
    const record = progress.answers[String(id)];
    if (record) {
      answered += 1;
      if (record.correct) correct += 1;
    }
    if (progress.mistakes[String(id)]) mistakes += 1;
  }
  return {
    answered,
    correct,
    mistakes,
    best: progress.best[`section-${sectionId}`],
  };
}

export function mistakesInSection(progress: Progress, sectionId: number): number {
  return sectionStats(progress, sectionId).mistakes;
}

export function bestPercent(score: { correct: number; total: number } | undefined): number {
  if (!score || score.total === 0) return 0;
  return Math.round((score.correct / score.total) * 100);
}
