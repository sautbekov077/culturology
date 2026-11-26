import { useEffect, useRef, useState } from 'react';
import { IconArrowRight, IconCheck, IconTarget, IconXCircle } from '../components/Icons';
import { Modal } from '../components/Modal';
import { IconClose } from '../components/Icons';
import { getSection } from '../data/sections';
import { buildMistakesQuiz, buildQuickQuiz, buildSectionQuiz } from '../lib/quiz';
import { href } from '../lib/route';
import type { Progress, QuizItem, QuizMode, QuizOutcome, SessionAnswer } from '../types';

type Props = {
  mode: QuizMode;
  sectionId?: number;
  progress: Progress;
  onAnswer: (questionId: number, correct: boolean, selected: number, selectedText: string) => void;
  onFinish: (outcome: QuizOutcome) => void;
};

const LETTERS = ['А', 'Б', 'В', 'Г', 'Д'];

export function QuizScreen({ mode, sectionId, progress, onAnswer, onFinish }: Props) {
  const [items] = useState<QuizItem[]>(() => {
    if (mode === 'section') return buildSectionQuiz(sectionId ?? 1);
    if (mode === 'quick') return buildQuickQuiz(20);
    return buildMistakesQuiz(progress, sectionId ?? null);
  });

  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<SessionAnswer[]>([]);
  const [exitOpen, setExitOpen] = useState(false);
  const startedAt = useRef(Date.now());
  const finishedRef = useRef(false);

  const section = getSection(sectionId);
  const title =
    mode === 'section'
      ? `Раздел ${String(sectionId).padStart(2, '0')} · ${section?.title ?? ''}`
      : mode === 'quick'
        ? 'Случайный тест'
        : sectionId
          ? `Ошибки раздела ${String(sectionId).padStart(2, '0')}`
          : 'Работа над ошибками';

  const topLabel = mode === 'section' ? `Раздел ${String(sectionId).padStart(2, '0')}` : mode === 'quick' ? 'Случайный тест' : 'Ошибки';
  const exitHref = sectionId ? `/section/${sectionId}` : '/';

  const item = items[index];
  const correctCount = answers.filter((answer) => answer.correct).length;

  useEffect(() => {
    if (selected !== null || exitOpen || !item) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      if (!/^[1-5]$/.test(event.key)) return;
      const optionIndex = Number(event.key) - 1;
      if (optionIndex >= item.options.length) return;
      choose(optionIndex);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selected, exitOpen, item]);

  if (items.length === 0) {
    return (
      <div className="quiz">
        <div className="quiz-top-wrap">
          <div className="quiz-top">
            <a className="icon-btn" href={href(exitHref)} aria-label="Закрыть">
              <IconClose size={22} />
            </a>
            <div className="quiz-progress">
              <span className="quiz-progress-solo">{title}</span>
            </div>
            <span className="quiz-score-placeholder" />
          </div>
        </div>
        <main className="quiz-main quiz-empty-main">
          <div className="empty">
            <div className="empty-icon">
              <IconTarget size={30} />
            </div>
            <h1>{sectionId ? 'В этом разделе ошибок нет' : 'Ошибок пока нет'}</h1>
            <p>
              {sectionId
                ? 'Отличная работа: все вопросы раздела, где были ошибки, уже разобраны. Можно пройти раздел заново.'
                : 'Пройдите раздел или случайный тест. Всё, что не получится с первого раза, попадёт сюда для повторения.'}
            </p>
            <div className="empty-actions">
              <a className="btn btn-primary btn-block" href={href(sectionId ? `/section/${sectionId}` : '/')}>
                {sectionId ? 'К разделу' : 'К разделам'}
              </a>
              <a className="btn btn-ghost btn-block" href={href('/quiz/quick')}>
                Случайные 20 вопросов
              </a>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const correctText = item.options[item.correct].text;
  const isCorrect = selected !== null && selected === item.correct;
  const percent = Math.round(((index + (selected !== null ? 1 : 0)) / items.length) * 100);
  const isLast = index + 1 >= items.length;

  function choose(optionIndex: number) {
    if (selected !== null) return;
    const option = item.options[optionIndex];
    if (!option) return;
    const correct = optionIndex === item.correct;
    setSelected(optionIndex);
    setAnswers((current) => [
      ...current,
      {
        questionId: item.question.id,
        selected: optionIndex,
        selectedText: option.text,
        correct,
      },
    ]);
    onAnswer(item.question.id, correct, optionIndex, option.text);
  }

  function finish() {
    if (finishedRef.current) return;
    finishedRef.current = true;
    const outcome: QuizOutcome = {
      mode,
      sectionId: sectionId ?? undefined,
      title,
      correct: answers.filter((answer) => answer.correct).length,
      total: items.length,
      answers,
      at: Date.now(),
      durationMs: Date.now() - startedAt.current,
    };
    onFinish(outcome);
  }

  function next() {
    if (selected === null) return;
    if (isLast) {
      finish();
      return;
    }
    setIndex((current) => current + 1);
    setSelected(null);
    window.scrollTo({ top: 0 });
  }

  return (
    <div className="quiz">
      <div className="quiz-top-wrap">
        <div className="quiz-top">
          <button
            type="button"
            className="icon-btn"
            onClick={() => setExitOpen(true)}
            aria-label="Выйти из теста"
          >
            <IconClose size={22} />
          </button>
          <div className="quiz-progress">
            <div className="quiz-progress-meta">
              <span>{topLabel}</span>
              <span>
                {index + 1} / {items.length}
              </span>
            </div>
            <div className="bar">
              <i style={{ width: `${percent}%` }} />
            </div>
          </div>
          <span className="quiz-score" title="Верных ответов">
            <IconCheck size={14} />
            {correctCount}
          </span>
        </div>
      </div>

      <main className="quiz-main">
        <div className="quiz-card" key={item.question.id}>
          <div className="quiz-meta">
            <span className="pill">Раздел {String(item.question.section).padStart(2, '0')}</span>
            <span className="quiz-meta-tag">{getSection(item.question.section)?.tag}</span>
          </div>

          <h1 className="quiz-question">{item.question.question}</h1>

          <div className="options" role="group" aria-label="Варианты ответа">
            {item.options.map((option, optionIndex) => {
              const isChosen = selected === optionIndex;
              const revealCorrect = selected !== null && optionIndex === item.correct;
              const revealWrong = selected !== null && isChosen && optionIndex !== item.correct;
              const classNames = [
                'option',
                revealCorrect ? 'is-correct' : '',
                revealWrong ? 'is-wrong' : '',
                selected !== null && !revealCorrect && !revealWrong ? 'is-muted' : '',
              ]
                .filter(Boolean)
                .join(' ');

              return (
                <button
                  type="button"
                  key={`${item.question.id}-${option.original}`}
                  className={classNames}
                  onClick={() => choose(optionIndex)}
                  disabled={selected !== null}
                >
                  <span className="option-letter">{LETTERS[optionIndex]}</span>
                  <span className="option-text">{option.text}</span>
                  {revealCorrect && (
                    <span className="option-state is-correct">
                      <IconCheck size={18} />
                    </span>
                  )}
                  {revealWrong && (
                    <span className="option-state is-wrong">
                      <IconXCircle size={18} />
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {selected !== null && (
            <div className={`feedback ${isCorrect ? 'is-good' : 'is-bad'}`} role="status" aria-live="polite">
              <span className="feedback-icon">
                {isCorrect ? <IconCheck size={20} /> : <IconXCircle size={20} />}
              </span>
              <div>
                <p className="feedback-title">{isCorrect ? 'Верно' : 'Неверно'}</p>
                <p className="feedback-body">
                  {isCorrect ? (
                    'Ответ засчитан. Переходите к следующему вопросу.'
                  ) : (
                    <>
                      Правильный ответ: <strong>{correctText}</strong>
                    </>
                  )}
                </p>
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="quiz-footer">
        <div className="quiz-footer-inner">
          {selected === null ? (
            <p className="quiz-hint">
              Выберите один вариант ответа
              <span className="hint-desktop"> · можно клавишами 1–5</span>
            </p>
          ) : (
            <button type="button" className="btn btn-primary btn-block" onClick={next}>
              {isLast ? 'Показать результат' : 'Следующий вопрос'}
              <IconArrowRight size={19} />
            </button>
          )}
        </div>
      </footer>

      <Modal
        open={exitOpen}
        title="Выйти из теста?"
        onClose={() => setExitOpen(false)}
        actions={
          <>
            <button type="button" className="btn btn-ghost" onClick={() => setExitOpen(false)} autoFocus>
              Продолжить
            </button>
            <a className="btn btn-primary" href={href(exitHref)}>
              Выйти
            </a>
          </>
        }
      >
        <p>
          Ответы уже сохранены в общем прогрессе, но результат этой попытки не будет записан в
          лучшие. Вы сможете начать тест заново.
        </p>
      </Modal>
    </div>
  );
}
