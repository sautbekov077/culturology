import { href } from '../lib/route';
import { IconBack, IconInfo } from './Icons';

type Props = {
  title?: string;
  backTo?: string;
};

export function AppBar({ title, backTo }: Props) {
  return (
    <header className="appbar">
      <div className="appbar-inner">
        {backTo ? (
          <>
            <a className="icon-btn" href={href(backTo)} aria-label="Назад">
              <IconBack size={22} />
            </a>
            <div className="appbar-titles">
              <span className="appbar-kicker">Культурология</span>
              {title && <span className="appbar-title">{title}</span>}
            </div>
            <span className="appbar-spacer" aria-hidden="true" />
          </>
        ) : (
          <>
            <a className="brand" href={href('/')} aria-label="Культурология — на главную">
              <img src="./icons/favicon.svg" alt="" width={36} height={36} />
              <span className="brand-text">
                <span className="brand-name">Культурология</span>
                <span className="brand-sub">тренажёр · 300 вопросов</span>
              </span>
            </a>
            <a className="icon-btn appbar-info" href={href('/about')} aria-label="О приложении и источниках">
              <IconInfo size={21} />
            </a>
          </>
        )}
      </div>
    </header>
  );
}
