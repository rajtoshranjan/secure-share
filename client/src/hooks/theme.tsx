import { useEffect } from 'react';
import { useLocalStorage } from 'usehooks-ts';
import { Theme } from './enums';

export const useTheme = () => {
  // Helpers.
  const isSystemThemeDark = () =>
    window.matchMedia('(prefers-color-scheme: dark)').matches;

  // States.
  const [theme, setTheme] = useLocalStorage<Theme>(
    'theme',
    isSystemThemeDark() ? Theme.Dark : Theme.Light,
  );

  // useEffects.
  useEffect(() => {
    const darkThemeMq = window.matchMedia('(prefers-color-scheme: dark)');

    const mqListener = (event: MediaQueryListEvent) => {
      setTheme(event.matches ? Theme.Dark : Theme.Light);
    };

    darkThemeMq.addEventListener('change', mqListener);

    return () => darkThemeMq.removeEventListener('change', mqListener);
  }, []);

  useEffect(() => {
    document.body.classList.remove('light', 'dark');
    document.body.classList.add(theme);
  }, [theme]);

  return { theme, setTheme };
};
