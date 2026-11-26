import {
  IconArrowRight,
  IconCheckCircle,
  IconInfo,
  IconRotate,
  IconSparkles,
  IconTarget,
  IconXCircle,
} from '../components/Icons';
import { href } from '../lib/route';
import { bestPercent, sectionStats } from '../lib/storage';
import type { Progress, SectionMeta } from '../types';

type Props = {
  section: SectionMeta;
  progress: Progress;
};

export function SectionScreen({ section, progress }: Props) {
  const stats = sectionStats(progress, section.id);
  const best = bestPercent(stats.best);
  const percent = Math.round((stats.answered / 30) * 100);
  const firstId = (section.id - 1) * 30 + 1;

  return (
    <div className="page">
      <section className="section-hero">
        <span className="section-hero-watermark" aria-hidden="true">
          {String(section.id).padStart(2, '0')}
        </span>
        <p className="eyebrow">Раздел {String(section.id).padStart(2, '0')} · {section.tag}</p>
        <h1>{section.title}</h1>
        <p className="section-hero-desc">{section.description}</p>
        <div className="section-hero-bar">
          <div className="bar" aria-hidden="true">
            <i style={{ width: `${percent}%` }} />
          </div>
          <span>{percent}% изучено</span>
        </div>
      </section>

      <div className="stat-grid">
        <div className="stat">
          <strong>
            {stats.answered}
            <small>/30</small>
          </strong>
          <span>изучено</span>
        </div>
        <div className="stat">
          <strong>{stats.correct}</strong>
          <span>верно</span>
        </div>
        <div className="stat">
          <strong>{stats.best ? `${best}%` : '—'}</strong>
          <span>лучший результат</span>
        </div>
      </div>

      <div className="action-stack">
        <a className="btn btn-primary btn-block" href={href(`/quiz/section/${section.id}`)}>
          {stats.best ? <IconRotate size={20} /> : <IconSparkles size={20} />}
          {stats.best ? 'Пройти раздел ещё раз' : 'Начать раздел'}
          <span className="btn-tail">30 вопросов</span>
        </a>

        {stats.mistakes > 0 && (
          <a
            className="btn btn-soft btn-block"
            href={href(`/quiz/mistakes/${section.id}`)}
          >
            <IconTarget size={20} />
            Повторить ошибки раздела
            <span className="btn-tail">{stats.mistakes}</span>
          </a>
        )}
      </div>

      <section className="card question-map" aria-labelledby="map-title">
        <div className="card-head">
          <h2 id="map-title">Карта вопросов</h2>
          <span className="muted-small">30 вопросов</span>
        </div>
        <div className="chips" aria-hidden="true">
          {Array.from({ length: 30 }, (_, index) => {
            const id = firstId + index;
            const record = progress.answers[String(id)];
            const state = !record ? 'is-empty' : record.correct ? 'is-correct' : 'is-wrong';
            return (
              <span className={`chip ${state}`} key={id}>
                {index + 1}
              </span>
            );
          })}
        </div>
        <div className="legend">
          <span>
            <i className="legend-dot is-correct" /> верно
          </span>
          <span>
            <i className="legend-dot is-wrong" /> ошибка
          </span>
          <span>
            <i className="legend-dot is-empty" /> без ответа
          </span>
        </div>
      </section>

      <section className="card tip-card">
        <span className="tip-icon">
          <IconInfo size={19} />
        </span>
        <div>
          <h2>Как проходить</h2>
          <p>
            Отвечайте без подсказок: после выбора сразу видно, верно ли вы ответили. Ошибки
            сохраняются в отдельный список — к ним можно вернуться в любой момент.
          </p>
        </div>
      </section>

      {stats.answered > 0 && (
        <p className="section-footnote">
          {stats.correct} верных из {stats.answered} отвеченных
          {stats.mistakes > 0 && (
            <>
              {' · '}
              <span className="text-red">
                <IconXCircle size={14} /> {stats.mistakes} на повтор
              </span>
            </>
          )}
          {stats.mistakes === 0 && stats.answered === 30 && (
            <>
              {' · '}
              <span className="text-green">
                <IconCheckCircle size={14} /> все ошибки разобраны
              </span>
            </>
          )}
        </p>
      )}

      <a className="btn btn-ghost btn-block" href={href('/')}>
        <IconArrowRight size={18} className="flip-x" />
        Ко всем разделам
      </a>
    </div>
  );
}
