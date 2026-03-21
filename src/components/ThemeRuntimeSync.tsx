import { useEffect } from 'react';
import { useTheme } from 'next-themes';

const LIGHT_THEME_COLOR = '#fffefe';
const DARK_THEME_COLOR = '#0f121a';

const ThemeRuntimeSync = () => {
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    if (!resolvedTheme) return;

    const root = document.documentElement;
    const themeColorMeta = document.querySelector('meta[name="theme-color"]');
    const themeColor = resolvedTheme === 'dark' ? DARK_THEME_COLOR : LIGHT_THEME_COLOR;

    root.style.colorScheme = resolvedTheme;
    themeColorMeta?.setAttribute('content', themeColor);
  }, [resolvedTheme]);

  return null;
};

export default ThemeRuntimeSync;
