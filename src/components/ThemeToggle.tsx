import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

const THEME_TRANSITION_MS = 400;
const LIGHT_THEME_COLOR = '#fffefe';
const DARK_THEME_COLOR = '#0f121a';

type ThemeToggleProps = {
    compact?: boolean;
};

const ThemeToggle = ({ compact = false }: ThemeToggleProps) => {
    const { setTheme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const ignoreClickUntilRef = useRef(0);
    const toggleLockRef = useRef(false);
    const transitionTimeoutRef = useRef<number | null>(null);
    const toggleSizeClass = compact ? 'h-9 w-9' : 'h-11 w-11';
    const iconSizeClass = compact ? 'w-[18px] h-[18px]' : 'w-5 h-5';

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

    if (!mounted || !resolvedTheme) {
        return (
            <button
                type="button"
                className={`${toggleSizeClass} rounded-full flex items-center justify-center border border-border bg-card`}
                aria-label="Toggle theme"
            >
                <span className={`${iconSizeClass} bg-muted-foreground/20 rounded-full animate-pulse`} />
            </button>
        );
    }

    const isDark = resolvedTheme === 'dark';

    return (
        <button
            type="button"
            onPointerDown={handlePointerDown}
            onClick={handleClick}
            className={`relative ${toggleSizeClass} rounded-full flex items-center justify-center border border-border bg-card transition-colors hover:bg-secondary btn-press`}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
            <Sun className={`absolute ${iconSizeClass} text-primary transition-all duration-300 ${isDark ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 rotate-90 scale-50'}`} />
            <Moon className={`absolute ${iconSizeClass} text-primary transition-all duration-300 ${isDark ? 'opacity-0 -rotate-90 scale-50' : 'opacity-100 rotate-0 scale-100'}`} />
        </button>
    );
};

export default ThemeToggle;
