import { href } from '../lib/route';
import type { Route } from '../types';
import { IconHome, IconInfo, IconTarget } from './Icons';

type Props = {
  route: Route;
  mistakes: number;
};

export function BottomNav({ route, mistakes }: Props) {
  const isHome = route.name === 'home';
  const isMistakes = route.name === 'quiz' && route.mode === 'mistakes';
  const isAbout = route.name === 'about';

  return (
    <nav className="bottom-nav" aria-label="Основная навигация">
      <div className="bottom-nav-inner">
        <a className={`nav-item${isHome ? ' is-active' : ''}`} href={href('/')} aria-current={isHome ? 'page' : undefined}>
          <IconHome size={22} />
          <span>Главная</span>
        </a>
        <a
          className={`nav-item${isMistakes ? ' is-active' : ''}`}
          href={href('/quiz/mistakes')}
          aria-current={isMistakes ? 'page' : undefined}
        >
          <span className="nav-icon">
            <IconTarget size={22} />
            {mistakes > 0 && <span className="nav-badge">{mistakes > 99 ? '99+' : mistakes}</span>}
          </span>
          <span>Ошибки</span>
        </a>
        <a className={`nav-item${isAbout ? ' is-active' : ''}`} href={href('/about')} aria-current={isAbout ? 'page' : undefined}>
          <IconInfo size={22} />
          <span>Справка</span>
        </a>
      </div>
    </nav>
  );
}
