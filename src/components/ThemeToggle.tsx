import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

const THEME_TRANSITION_MS = 400;

type ThemeToggleProps = {
    compact?: boolean;
};

const ThemeToggle = ({ compact = false }: ThemeToggleProps) => {
    const { setTheme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const toggleSizeClass = compact ? 'h-9 w-9' : 'h-11 w-11';
    const iconSizeClass = compact ? 'w-[18px] h-[18px]' : 'w-5 h-5';

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleToggle = useCallback(() => {
        const root = document.documentElement;
        root.classList.add('theme-transitioning');
        setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
        window.setTimeout(() => {
            root.classList.remove('theme-transitioning');
        }, THEME_TRANSITION_MS);
    }, [resolvedTheme, setTheme]);

    if (!mounted) {
        return (
            <button className={`${toggleSizeClass} rounded-full flex items-center justify-center border border-border bg-card`} aria-label="Toggle theme">
                <span className={`${iconSizeClass} bg-muted-foreground/20 rounded-full animate-pulse`} />
            </button>
        );
    }

    const isDark = resolvedTheme === 'dark';

    return (
        <button
            onClick={handleToggle}
            className={`relative ${toggleSizeClass} rounded-full flex items-center justify-center border border-border bg-card transition-colors hover:bg-secondary btn-press`}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
            <Sun className={`absolute ${iconSizeClass} text-primary transition-all duration-300 ${isDark ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 rotate-90 scale-50'}`} />
            <Moon className={`absolute ${iconSizeClass} text-primary transition-all duration-300 ${isDark ? 'opacity-0 -rotate-90 scale-50' : 'opacity-100 rotate-0 scale-100'}`} />
        </button>
    );
};

export default ThemeToggle;
