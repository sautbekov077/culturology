import { IosHint } from '../components/IosHint';
import {
  IconArrowRight,
  IconChevronRight,
  IconLayers,
  IconShuffle,
  IconSparkles,
  IconTarget,
} from '../components/Icons';
import { LogoMark } from '../components/LogoMark';
import { SECTIONS } from '../data/sections';
import { bestPercent, overallStats, sectionStats } from '../lib/storage';
import { plural } from '../lib/format';
import { href } from '../lib/route';
import type { Progress } from '../types';

export function HomeScreen({ progress }: { progress: Progress }) {
  const overall = overallStats(progress);
  const overallPercent = Math.round((overall.answered / 300) * 100);

  return (
    <div className="page">
      <section className="hero">
        <LogoMark className="hero-mark" />
        <p className="hero-kicker">
          <span className="hero-dot" aria-hidden="true" />
          Тренажёр · 300 вопросов
        </p>
        <h1>
          Культурология
          <span>от теории до символа</span>
        </h1>
        <p className="hero-lead">
          Десять разделов, один верный ответ и мгновенный разбор. Учитесь в своём темпе — прогресс
          сохраняется на устройстве.
        </p>

        <div className="hero-stats">
          <div className="hero-stat">
            <strong>
              {overall.answered}
              <small>/300</small>
            </strong>
            <span>изучено</span>
          </div>
          <div className="hero-stat">
            <strong>{overall.accuracy}%</strong>
            <span>точность</span>
          </div>
          <div className="hero-stat">
            <strong>{overall.mistakes}</strong>
            <span>на повтор</span>
          </div>
        </div>

        <a className="btn btn-light" href={href('/quiz/quick')}>
          <IconShuffle size={20} />
          Случайные 20 вопросов
        </a>
      </section>

      <IosHint />

      {overall.mistakes > 0 && (
        <a className="mistake-banner" href={href('/quiz/mistakes')}>
          <span className="mistake-banner-icon">
            <IconTarget size={21} />
          </span>
          <span className="mistake-banner-text">
            <strong>Работа над ошибками</strong>
            <span>
              {overall.mistakes} {plural(overall.mistakes, 'вопрос', 'вопроса', 'вопросов')} ждёт повторения
            </span>
          </span>
          <span className="mistake-banner-count">{overall.mistakes}</span>
          <IconChevronRight size={18} />
        </a>
      )}

      <section className="home-sections" aria-labelledby="sections-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow">
              <IconLayers size={14} /> Программа курса
            </p>
            <h2 id="sections-title">10 разделов</h2>
          </div>
          <div className="overall-progress">
            <span>
              {overall.answered} / 300
            </span>
            <div className="bar" aria-hidden="true">
              <i style={{ width: `${overallPercent}%` }} />
            </div>
          </div>
        </div>

        <div className="section-list">
          {SECTIONS.map((section) => {
            const stats = sectionStats(progress, section.id);
            const percent = Math.round((stats.answered / 30) * 100);
            const best = bestPercent(stats.best);
            return (
              <a className="section-card" href={href(`/section/${section.id}`)} key={section.id}>
                <span className="section-index">{String(section.id).padStart(2, '0')}</span>
                <span className="section-body">
                  <span className="section-card-top">
                    <span className="section-card-title">{section.title}</span>
                    {stats.best && <span className="best-chip">{best}%</span>}
                  </span>
                  <span className="section-card-desc">{section.description}</span>
                  <span className="section-card-meta">
                    <span className="bar" aria-hidden="true">
                      <i style={{ width: `${percent}%` }} />
                    </span>
                    <span className="section-card-count">
                      {stats.answered > 0 ? `${stats.answered} / 30` : '30 вопросов'}
                    </span>
                  </span>
                </span>
                <IconChevronRight size={18} className="section-chevron" />
              </a>
            );
          })}
        </div>
      </section>

      <div className="home-note">
        <IconSparkles size={18} />
        <p>
          Вопросы 251–300 опираются на исследование Зиры Наурызбаевой о Коркуте и тенгрианстве.{' '}
          <a href={href('/about')}>Об источниках и проверке ответов</a>
        </p>
      </div>

      <a className="btn btn-ghost home-about-link" href={href('/about')}>
        Как устроен тренажёр и как установить его на телефон
        <IconArrowRight size={18} />
      </a>
    </div>
  );
}
