import { Moon, Sun } from 'lucide-react';
import { useAppearance } from '@/hooks/use-appearance';

/** A light and dark mode switch for the top bar. */
export default function ThemeToggle() {
    const { resolvedAppearance, updateAppearance } = useAppearance();
    const isDark = resolvedAppearance === 'dark';

    return (
        <button
            type="button"
            role="switch"
            aria-checked={isDark}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            onClick={() => updateAppearance(isDark ? 'light' : 'dark')}
            className="relative inline-flex h-9 w-[70px] shrink-0 items-center rounded-full border bg-card p-1 shadow-xs transition hover:shadow-md focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
        >
            <span
                className={`absolute top-1 size-7 rounded-full bg-gradient-to-br from-violet-600 via-primary to-sky-500 shadow-md transition-transform duration-300 ${
                    isDark ? 'translate-x-[34px]' : 'translate-x-0'
                }`}
                aria-hidden="true"
            />
            <span className={`relative z-10 flex w-1/2 justify-center transition-colors ${isDark ? 'text-muted-foreground' : 'text-white'}`} aria-hidden="true">
                <Sun className="size-4" />
            </span>
            <span className={`relative z-10 flex w-1/2 justify-center transition-colors ${isDark ? 'text-white' : 'text-muted-foreground'}`} aria-hidden="true">
                <Moon className="size-4" />
            </span>
        </button>
    );
}
