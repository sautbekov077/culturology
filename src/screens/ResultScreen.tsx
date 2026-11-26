import type { CSSProperties } from 'react';
import {
  IconArrowRight,
  IconCheck,
  IconCheckCircle,
  IconChevronRight,
  IconClock,
  IconRotate,
  IconSparkles,
  IconTarget,
  IconTrophy,
  IconXCircle,
} from '../components/Icons';
import { formatDuration, plural } from '../lib/format';
import { getQuestionById } from '../lib/quiz';
import { href } from '../lib/route';
import { overallStats, sectionStats } from '../lib/storage';
import type { Progress, QuizResult } from '../types';

type Props = {
  result: QuizResult | null;
  progress: Progress;
};

function grade(percent: number): { title: string; text: string } {
  if (percent >= 90) return { title: 'Блестяще', text: 'Материал усвоен уверенно. Можно двигаться дальше.' };
  if (percent >= 75) return { title: 'Очень хорошо', text: 'Осталось закрепить несколько деталей — и будет отлично.' };
  if (percent >= 60) return { title: 'Хороший старт', text: 'Разберите ошибки и попробуйте ещё раз: результат заметно вырастет.' };
  return { title: 'Нужно повторить', text: 'Загляните в разбор ошибок и вернитесь к разделу. Всё получится.' };
}

export function ResultScreen({ result, progress }: Props) {
  if (!result) {
    return (
      <div className="page">
        <div className="empty">
          <div className="empty-icon">
            <IconTrophy size={30} />
          </div>
          <h1>Результат не найден</h1>
          <p>Похоже, страница открыта напрямую. Начните тест — и результат появится здесь.</p>
          <div className="empty-actions">
            <a className="btn btn-primary btn-block" href={href('/quiz/quick')}>
              Случайные 20 вопросов
            </a>
            <a className="btn btn-ghost btn-block" href={href('/')}>
              К разделам
            </a>
          </div>
        </div>
      </div>
    );
  }

  const percent = result.total === 0 ? 0 : Math.round((result.correct / result.total) * 100);
  const wrong = result.answers.filter((answer) => !answer.correct);
  const remaining =
    result.mode === 'section' && result.sectionId
      ? sectionStats(progress, result.sectionId).mistakes
      : overallStats(progress).mistakes;
  const gradeInfo = grade(percent);

  const restartHref =
    result.mode === 'section' && result.sectionId
      ? `/quiz/section/${result.sectionId}`
      : result.mode === 'quick'
        ? '/quiz/quick'
        : result.sectionId
          ? `/quiz/mistakes/${result.sectionId}`
          : '/quiz/mistakes';

  const reviewHref = result.sectionId ? `/quiz/mistakes/${result.sectionId}` : '/quiz/mistakes';
  const restartLabel =
    result.mode === 'section'
      ? 'Пройти раздел ещё раз'
      : result.mode === 'quick'
        ? 'Ещё 20 вопросов'
        : 'Повторить оставшиеся';

  return (
    <div className="page result-page">
      <div className="result-head">
        <p className="eyebrow">{result.title}</p>
        <h1>{gradeInfo.title}</h1>
        <p>{gradeInfo.text}</p>
      </div>

      <div
        className={`score-ring ${percent >= 60 ? 'is-good' : 'is-low'}`}
        style={{ '--pct': percent } as CSSProperties}
        role="img"
        aria-label={`Результат: ${percent} процентов, ${result.correct} из ${result.total}`}
      >
        <div className="score-ring-inner">
          <strong>{percent}%</strong>
          <span>
            {result.correct} из {result.total}
          </span>
        </div>
      </div>

      {result.newBest && (
        <p className="new-best">
          <IconSparkles size={16} /> Новый личный рекорд раздела
        </p>
      )}

      {result.mode === 'mistakes' && remaining === 0 && (
        <p className="all-clear">
          <IconCheckCircle size={18} /> Все ошибки разобраны. Отличная работа!
        </p>
      )}

      <div className="result-stats">
        <div className="result-stat">
          <span className="result-stat-icon is-green">
            <IconCheck size={18} />
          </span>
          <strong>{result.correct}</strong>
          <span>верно</span>
        </div>
        <div className="result-stat">
          <span className="result-stat-icon is-red">
            <IconXCircle size={18} />
          </span>
          <strong>{result.total - result.correct}</strong>
          <span>{plural(result.total - result.correct, 'ошибка', 'ошибки', 'ошибок')}</span>
        </div>
        <div className="result-stat">
          <span className="result-stat-icon">
            <IconClock size={18} />
          </span>
          <strong>{formatDuration(result.durationMs)}</strong>
          <span>время</span>
        </div>
      </div>

      <div className="result-actions">
        <a className="btn btn-primary btn-block" href={href(restartHref)}>
          <IconRotate size={20} />
          {restartLabel}
        </a>
        {wrong.length > 0 && remaining > 0 && (
          <a className="btn btn-soft btn-block" href={href(reviewHref)}>
            <IconTarget size={20} />
            Разобрать ошибки
            <span className="btn-tail">{remaining}</span>
          </a>
        )}
        <a className="btn btn-ghost btn-block" href={href('/')}>
          К разделам
          <IconArrowRight size={18} />
        </a>
      </div>

      {wrong.length > 0 && (
        <details className="review">
          <summary>
            <span>
              Разбор ошибок <span className="review-count">{wrong.length}</span>
            </span>
            <IconChevronRight size={18} className="review-chevron" />
          </summary>
          <ol className="review-list">
            {wrong.map((answer) => {
              const question = getQuestionById(answer.questionId);
              if (!question) return null;
              const correctText = question.options[question.answer];
              return (
                <li className="review-item" key={answer.questionId}>
                  <p className="review-question">
                    <span className="review-number">{answer.questionId}</span>
                    {question.question}
                  </p>
                  <p className="review-answer is-wrong">
                    Ваш ответ: {answer.selectedText}
                  </p>
                  <p className="review-answer is-right">
                    Правильно: {correctText}
                  </p>
                </li>
              );
            })}
          </ol>
        </details>
      )}

      <p className="result-note">
        Прогресс сохранён на этом устройстве. Ошибки автоматически попали в раздел «Ошибки» —
        вернитесь к ним, когда будет удобно.
      </p>
    </div>
  );
}
