import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

const ThemeToggle = () => {
    const { setTheme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // Avoid hydration mismatch
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <button className="h-9 w-9 rounded-full flex items-center justify-center border border-white/35 bg-white/20 backdrop-blur-sm dark:border-white/10 dark:bg-white/5" aria-label="Toggle theme">
                <span className="w-5 h-5 bg-muted-foreground/20 rounded-full animate-pulse" />
            </button>
        );
    }

    const isDark = resolvedTheme === 'dark';

    return (
        <button
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            className="h-9 w-9 rounded-full flex items-center justify-center border border-white/35 bg-card/80 backdrop-blur-sm transition-colors hover:bg-white/35 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10 btn-press"
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
            {isDark ? (
                <Sun className="w-5 h-5 text-primary" />
            ) : (
                <Moon className="w-5 h-5 text-primary" />
            )}
        </button>
    );
};

export default ThemeToggle;
