import { useEffect, useState } from 'react';
import { dismissIosHint, isIosHintDismissed } from '../lib/storage';
import { IconClose, IconShare } from './Icons';

function isIos(): boolean {
  const ua = navigator.userAgent;
  const touchMac = navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1;
  return /iPad|iPhone|iPod/.test(ua) || touchMac;
}

function isStandalone(): boolean {
  const navigatorWithStandalone = navigator as Navigator & { standalone?: boolean };
  return window.matchMedia('(display-mode: standalone)').matches || navigatorWithStandalone.standalone === true;
}

export function IosHint() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(isIos() && !isStandalone() && !isIosHintDismissed());
  }, []);

  if (!visible) return null;

  return (
    <aside className="ios-hint" aria-label="Установка на iPhone">
      <div className="ios-hint-icon">
        <IconShare size={20} />
      </div>
      <div className="ios-hint-text">
        <strong>Добавьте на экран «Домой»</strong>
        <span>
          Нажмите <b>Поделиться</b> → <b>На экран «Домой»</b>, чтобы открывать тренажёр как приложение.
        </span>
      </div>
      <button
        type="button"
        className="ios-hint-close"
        aria-label="Скрыть подсказку"
        onClick={() => {
          dismissIosHint();
          setVisible(false);
        }}
      >
        <IconClose size={16} />
      </button>
    </aside>
  );
}
