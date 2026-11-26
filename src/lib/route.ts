import { useEffect, useState } from 'react';
import type { Route } from '../types';

function parseSectionId(value: string | undefined): number | null {
  if (!value) return null;
  const id = Number(value);
  return Number.isInteger(id) && id >= 1 && id <= 10 ? id : null;
}

export function parseRoute(hash: string): Route {
  const path = (hash.replace(/^#/, '') || '/').split('?')[0];
  const parts = path.split('/').filter(Boolean);

  if (parts.length === 0) return { name: 'home' };
  if (parts[0] === 'about') return { name: 'about' };
  if (parts[0] === 'result') return { name: 'result' };

  if (parts[0] === 'section') {
    const sectionId = parseSectionId(parts[1]);
    return sectionId ? { name: 'section', sectionId } : { name: 'home' };
  }

  if (parts[0] === 'quiz') {
    if (parts[1] === 'quick') return { name: 'quiz', mode: 'quick' };
    if (parts[1] === 'mistakes') {
      return { name: 'quiz', mode: 'mistakes', sectionId: parseSectionId(parts[2]) };
    }
    if (parts[1] === 'section') {
      const sectionId = parseSectionId(parts[2]);
      return sectionId ? { name: 'quiz', mode: 'section', sectionId } : { name: 'home' };
    }
  }

  return { name: 'home' };
}

export function useRoute(): Route {
  const [route, setRoute] = useState<Route>(() => parseRoute(window.location.hash));

  useEffect(() => {
    const onHashChange = () => setRoute(parseRoute(window.location.hash));
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  return route;
}

export function href(path: string): string {
  return `#${path}`;
}
