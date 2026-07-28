import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

const THEME_TRANSITION_MS = 400;
const LIGHT_THEME_COLOR = '#fffefe';
const DARK_THEME_COLOR = '#0f121a';

type ThemeToggleProps = {
  compact?: boolean;
  variant?: 'icon' | 'segment';
};

const ThemeToggle = ({ compact = false, variant = 'icon' }: ThemeToggleProps) => {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const ignoreClickUntilRef = useRef(0);
  const toggleLockRef = useRef(false);
  const transitionTimeoutRef = useRef<number | null>(null);
  const isSegment = variant === 'segment';
  const iconSizeClass = compact ? 'h-[17px] w-[17px]' : 'h-[18px] w-[18px]';
  const iconToggleSizeClass = compact ? 'h-9 w-9' : 'h-11 w-11';
  const segmentSizeClass = compact ? 'h-8 w-9' : 'h-9 w-10';

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    return () => {
      if (transitionTimeoutRef.current !== null) {
        window.clearTimeout(transitionTimeoutRef.current);
      }
      document.documentElement.classList.remove('theme-transitioning');
      toggleLockRef.current = false;
    };
  }, []);

  const toggleTheme = useCallback(() => {
    if (toggleLockRef.current || !resolvedTheme) return;

    const root = document.documentElement;
    const themeColorMeta = document.querySelector('meta[name="theme-color"]');
    const nextTheme = resolvedTheme === 'dark' ? 'light' : 'dark';

    toggleLockRef.current = true;
    if (transitionTimeoutRef.current !== null) {
      window.clearTimeout(transitionTimeoutRef.current);
    }
    root.classList.add('theme-transitioning');
    root.style.colorScheme = nextTheme;
    if (themeColorMeta) {
      themeColorMeta.setAttribute('content', nextTheme === 'dark' ? DARK_THEME_COLOR : LIGHT_THEME_COLOR);
    }

    setTheme(nextTheme);
    transitionTimeoutRef.current = window.setTimeout(() => {
      root.classList.remove('theme-transitioning');
      toggleLockRef.current = false;
      transitionTimeoutRef.current = null;
    }, THEME_TRANSITION_MS);
  }, [resolvedTheme, setTheme]);

  const handlePointerDown = useCallback(
    (event: React.PointerEvent<HTMLButtonElement>) => {
      if (event.pointerType !== 'touch') return;

      ignoreClickUntilRef.current = Date.now() + THEME_TRANSITION_MS;
      event.preventDefault();
      toggleTheme();
    },
    [toggleTheme],
  );

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      if (Date.now() < ignoreClickUntilRef.current) {
        event.preventDefault();
        return;
      }

      toggleTheme();
    },
    [toggleTheme],
  );

  const buttonClassName = cn(
    'relative flex items-center justify-center rounded-full transition-colors duration-200',
    isSegment
      ? cn(
          segmentSizeClass,
          'text-muted-foreground hover:text-foreground/90 btn-press',
        )
      : cn(
          iconToggleSizeClass,
          'border border-border bg-card hover:bg-secondary btn-press',
        ),
  );

  if (!mounted || !resolvedTheme) {
    return (
      <button
        type="button"
        className={buttonClassName}
        aria-label="Toggle theme"
      >
        <span className={cn(iconSizeClass, 'rounded-full bg-muted-foreground/20 animate-pulse')} />
      </button>
    );
  }

  const isDark = resolvedTheme === 'dark';

  return (
    <button
      type="button"
      onPointerDown={handlePointerDown}
      onClick={handleClick}
      className={buttonClassName}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <Sun
        className={cn(
          'absolute transition-[color,opacity,transform] duration-300',
          iconSizeClass,
          isSegment ? 'text-foreground/75' : 'text-primary',
          isDark ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 rotate-90 scale-50',
        )}
      />
      <Moon
        className={cn(
          'absolute transition-[color,opacity,transform] duration-300',
          iconSizeClass,
          isSegment ? 'text-foreground/75' : 'text-primary',
          isDark ? 'opacity-0 -rotate-90 scale-50' : 'opacity-100 rotate-0 scale-100',
        )}
      />
    </button>
  );
};

export default ThemeToggle;
