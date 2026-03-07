import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

const THEME_TRANSITION_MS = 400;

const ThemeToggle = () => {
    const { setTheme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

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
            <button className="h-11 w-11 rounded-full flex items-center justify-center border border-border bg-card" aria-label="Toggle theme">
                <span className="w-5 h-5 bg-muted-foreground/20 rounded-full animate-pulse" />
            </button>
        );
    }

    const isDark = resolvedTheme === 'dark';

    return (
        <button
            onClick={handleToggle}
            className="relative h-11 w-11 rounded-full flex items-center justify-center border border-border bg-card transition-colors hover:bg-secondary btn-press"
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
            <Sun className={`absolute w-5 h-5 text-primary transition-all duration-300 ${isDark ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 rotate-90 scale-50'}`} />
            <Moon className={`absolute w-5 h-5 text-primary transition-all duration-300 ${isDark ? 'opacity-0 -rotate-90 scale-50' : 'opacity-100 rotate-0 scale-100'}`} />
        </button>
    );
};

export default ThemeToggle;
