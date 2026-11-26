import { useState } from 'react';
import { IconExternal, IconPlusSquare, IconShare, IconTrash } from '../components/Icons';
import { LogoMark } from '../components/LogoMark';
import { Modal } from '../components/Modal';
import { overallStats } from '../lib/storage';
import type { Progress } from '../types';

type Props = {
  progress: Progress;
  onReset: () => void;
};

const SOURCES = [
  {
    title: 'ЮНЕСКО · Петроглифы Тамгалы',
    note: 'Список всемирного наследия, 2004',
    url: 'https://whc.unesco.org/en/list/1145',
  },
  {
    title: 'ЮНЕСКО · Мавзолей Ходжи Ахмеда Ясави',
    note: 'Список всемирного наследия, 2003',
    url: 'https://whc.unesco.org/en/list/1103',
  },
  {
    title: 'ЮНЕСКО · Казахское традиционное искусство домбрового кюя',
    note: 'Нематериальное наследие, 2014',
    url: 'https://ich.unesco.org/en/RL/kazakh-traditional-art-of-dombra-kuy-00996',
  },
  {
    title: 'Театр им. М. Ауэзова · история',
    note: 'Первый казахский драматический театр, 1926',
    url: 'https://auezov-theatre.kz/ru/about/history',
  },
  {
    title: 'Akorda · «Болашаққа бағдар: рухани жаңғыру»',
    note: 'Программная статья, 2017',
    url: 'https://www.akorda.kz/kz/events/akorda_news/press_conferences/memleket-basshysynyn-bolashakka-bagdar-ruhani-zhangyru-atty-makalasy',
  },
  {
    title: 'Akorda · «Ұлы даланың жеті қыры»',
    note: 'Программная статья, 2018',
    url: 'https://www.akorda.kz/kz/events/akorda_news/press_conferences/memleket-basshysynyn-uly-dalanyn-zheti-kyry-atty-makalasy',
  },
  {
    title: 'Adilet · Государственная программа «Мәдени мұра»',
    note: 'Постановление, 2004',
    url: 'https://adilet.zan.kz/rus/docs/U040001277_',
  },
  {
    title: 'Зира Наурызбаева · «Коркут в тенгрианстве»',
    note: 'Основа вопросов 251–300',
    url: 'https://otuken.kz/korkut/',
  },
];

export function AboutScreen({ progress, onReset }: Props) {
  const [resetOpen, setResetOpen] = useState(false);
  const stats = overallStats(progress);

  return (
    <div className="page about-page">
      <section className="about-hero">
        <LogoMark className="about-mark" />
        <p className="eyebrow">О тренажёре</p>
        <h1>Культурология в 300 вопросах</h1>
        <p>
          Десять разделов по 30 вопросов: от базовых понятий теории культуры до казахской
          мифологии и символики. В каждом вопросе пять вариантов и один правильный ответ.
        </p>
        <div className="about-meta">
          <span><strong>300</strong> вопросов</span>
          <span><strong>10</strong> разделов</span>
          <span><strong>5</strong> вариантов</span>
        </div>
      </section>

      <section className="card about-card">
        <h2>Как заниматься</h2>
        <ol className="steps">
          <li>
            <span className="step-number">1</span>
            <div>
              <strong>Выберите раздел</strong>
              <p>Отвечайте на 30 вопросов: правильный вариант подсвечивается сразу, а ошибка — с пояснением.</p>
            </div>
          </li>
          <li>
            <span className="step-number">2</span>
            <div>
              <strong>Повторите ошибки</strong>
              <p>Неверно отвеченные вопросы попадают в отдельный список. Верный ответ в режиме повторения убирает вопрос из списка.</p>
            </div>
          </li>
          <li>
            <span className="step-number">3</span>
            <div>
              <strong>Проверьте себя</strong>
              <p>Случайные 20 вопросов из всех разделов помогают понять общий уровень. Лучшие результаты сохраняются по каждому разделу.</p>
            </div>
          </li>
        </ol>
      </section>

      <section className="card about-card">
        <h2>Источники и проверка</h2>
        <p>
          Ключевые факты ответов сверены с официальными страницами ЮНЕСКО, материалами театра
          им. М. Ауэзова, сайтом Akorda и правовой базой Adilet. Полный банк вопросов проверен на
          соответствие исходному документу; варианты ответов в тренажёре перемешиваются при каждом
          запуске.
        </p>
        <p className="about-warning">
          Вопросы 251–300 составлены по исследованию Зиры Наурызбаевой «Коркут в тенгрианстве» и
          отражают авторскую концепцию. Они не подаются как общепринятая учебная догма — при
          необходимости сверяйтесь с первоисточником.
        </p>
        <ul className="source-list">
          {SOURCES.map((source) => (
            <li key={source.url}>
              <a href={source.url} target="_blank" rel="noreferrer">
                <span>
                  <strong>{source.title}</strong>
                  <small>{source.note}</small>
                </span>
                <IconExternal size={17} />
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section className="card about-card">
        <h2>Установка на телефон</h2>
        <div className="install-row">
          <span className="install-icon">
            <IconShare size={21} />
          </span>
          <div>
            <strong>iPhone и iPad</strong>
            <p>
              Откройте сайт в Safari, нажмите «Поделиться» и выберите «На экран „Домой“».
              Приложение откроется без адресной строки.
            </p>
          </div>
        </div>
        <div className="install-row">
          <span className="install-icon">
            <IconPlusSquare size={21} />
          </span>
          <div>
            <strong>Android</strong>
            <p>
              В меню Chrome выберите «Установить приложение» или «Добавить на главный экран».
            </p>
          </div>
        </div>
        <p className="muted-small">
          После первого открытия приложение работает офлайн. Обновления подтягиваются, когда есть
          сеть.
        </p>
      </section>

      <section className="card about-card">
        <h2>Приватность</h2>
        <p>
          Нет аккаунтов, рекламы и аналитики. Прогресс и ошибки хранятся только в локальном
          хранилище браузера на вашем устройстве и никуда не отправляются.
        </p>
      </section>

      <section className="card danger-zone">
        <div>
          <h2>Прогресс на устройстве</h2>
          <p>
            Изучено {stats.answered} из 300 · ошибок на повтор: {stats.mistakes}
          </p>
        </div>
        <button type="button" className="btn btn-danger-ghost" onClick={() => setResetOpen(true)}>
          <IconTrash size={18} />
          Сбросить прогресс
        </button>
      </section>

      <p className="version-note">
        Культурология · тренажёр, версия 1.0 · 2026
      </p>

      <Modal
        open={resetOpen}
        title="Сбросить весь прогресс?"
        onClose={() => setResetOpen(false)}
        actions={
          <>
            <button type="button" className="btn btn-ghost" onClick={() => setResetOpen(false)} autoFocus>
              Отмена
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={() => {
                onReset();
                setResetOpen(false);
              }}
            >
              Сбросить
            </button>
          </>
        }
      >
        <p>
          Будут удалены все ответы, лучшие результаты и список ошибок. Отменить это действие
          нельзя.
        </p>
      </Modal>
    </div>
  );
}
