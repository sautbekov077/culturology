import { useEffect, useState } from 'react';
import { AppBar } from './components/AppBar';
import { BottomNav } from './components/BottomNav';
import { getSection } from './data/sections';
import { useRoute } from './lib/route';
import {
  clearAllProgress,
  emptyProgress,
  loadLastResult,
  loadProgress,
  overallStats,
  saveLastResult,
  saveProgress,
} from './lib/storage';
import type { Progress, QuizOutcome, QuizResult } from './types';
import { AboutScreen } from './screens/AboutScreen';
import { HomeScreen } from './screens/HomeScreen';
import { QuizScreen } from './screens/QuizScreen';
import { ResultScreen } from './screens/ResultScreen';
import { SectionScreen } from './screens/SectionScreen';

export default function App() {
  const route = useRoute();
  const [progress, setProgress] = useState<Progress>(() => loadProgress());
  const [result, setResult] = useState<QuizResult | null>(() => loadLastResult());

  const routeKey =
    route.name === 'section'
      ? `section-${route.sectionId}`
      : route.name === 'quiz'
        ? `quiz-${route.mode}-${route.mode === 'quick' ? '' : route.sectionId ?? ''}`
        : route.name;

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [routeKey]);

  const recordAnswer = (questionId: number, correct: boolean, selected: number) => {
    const at = Date.now();
    const answers = {
      ...progress.answers,
      [String(questionId)]: { correct, selected, at },
    };
    const mistakes = { ...progress.mistakes };
    if (correct) {
      delete mistakes[String(questionId)];
    } else {
      mistakes[String(questionId)] = {
        count: (mistakes[String(questionId)]?.count ?? 0) + 1,
        at,
      };
    }
    const next: Progress = { ...progress, answers, mistakes, lastAt: at };
    setProgress(next);
    saveProgress(next);
  };

  const finishQuiz = (outcome: QuizOutcome) => {
    const key =
      outcome.mode === 'section' && outcome.sectionId
        ? `section-${outcome.sectionId}`
        : outcome.mode === 'quick'
          ? 'quick'
          : null;
    const previous = key ? progress.best[key] : undefined;
    const ratio = outcome.total === 0 ? 0 : outcome.correct / outcome.total;
    const previousRatio = previous ? previous.correct / previous.total : 0;
    const newBest = Boolean(
      key &&
        outcome.total > 0 &&
        (!previous ||
          ratio > previousRatio ||
          (ratio === previousRatio && outcome.correct > previous.correct)),
    );

    const best =
      key && newBest
        ? {
            ...progress.best,
            [key]: { correct: outcome.correct, total: outcome.total, at: outcome.at },
          }
        : progress.best;

    const next: Progress = {
      ...progress,
      best,
      sessions: progress.sessions + 1,
      lastAt: outcome.at,
    };
    setProgress(next);
    saveProgress(next);

    const finalResult: QuizResult = { ...outcome, newBest };
    setResult(finalResult);
    saveLastResult(finalResult);
    window.location.hash = '/result';
  };

  const resetProgress = () => {
    clearAllProgress();
    const empty = emptyProgress();
    setProgress(empty);
    setResult(null);
    saveLastResult(null);
    window.location.hash = '/';
  };

  const section = route.name === 'section' ? getSection(route.sectionId) : undefined;
  const mistakes = overallStats(progress).mistakes;

  let appBarTitle: string | undefined;
  if (route.name === 'about') appBarTitle = 'О приложении';
  else if (route.name === 'result') appBarTitle = 'Результат';
  else if (route.name === 'section') appBarTitle = `Раздел ${String(route.sectionId).padStart(2, '0')}`;

  return (
    <div className="app">
      {route.name !== 'quiz' && (
        <AppBar title={appBarTitle} backTo={route.name === 'home' ? undefined : '/'} />
      )}

      {route.name === 'home' && <HomeScreen progress={progress} />}

      {route.name === 'section' &&
        (section ? (
          <SectionScreen section={section} progress={progress} />
        ) : (
          <HomeScreen progress={progress} />
        ))}

      {route.name === 'quiz' && (
        <QuizScreen
          key={routeKey}
          mode={route.mode}
          sectionId={
            route.mode === 'mistakes'
              ? route.sectionId ?? undefined
              : route.mode === 'section'
                ? route.sectionId
                : undefined
          }
          progress={progress}
          onAnswer={recordAnswer}
          onFinish={finishQuiz}
        />
      )}

      {route.name === 'result' && <ResultScreen result={result} progress={progress} />}

      {route.name === 'about' && <AboutScreen progress={progress} onReset={resetProgress} />}

      {route.name !== 'quiz' && <BottomNav route={route} mistakes={mistakes} />}
    </div>
  );
}
