import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

const ThemeToggle = () => {
    const { theme, setTheme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // Avoid hydration mismatch
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <button className="w-9 h-9 rounded-full flex items-center justify-center" aria-label="Toggle theme">
                <span className="w-5 h-5 bg-muted-foreground/20 rounded-full animate-pulse" />
            </button>
        );
    }

    const isDark = resolvedTheme === 'dark';

    return (
        <button
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            className="w-9 h-9 rounded-full flex items-center justify-center bg-secondary/70 border border-primary/15 hover:bg-secondary transition-colors btn-press"
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
            {isDark ? (
                <Sun className="w-5 h-5 text-brand-gold" />
            ) : (
                <Moon className="w-5 h-5 text-brand-teal" />
            )}
        </button>
    );
};

export default ThemeToggle;
