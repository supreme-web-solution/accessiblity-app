export type Tone = 'brand' | 'violet' | 'emerald' | 'amber' | 'rose' | 'sky' | 'slate';

type ToneClasses = {
    chip: string;
    text: string;
    bar: string;
    soft: string;
    solid: string;
    pill: string;
};

/** Colour sets used across the app. Class names are written out in full so the build keeps them. */
export const TONE: Record<Tone, ToneClasses> = {
    brand: {
        chip: 'bg-primary/10 text-primary',
        text: 'text-primary',
        bar: 'bg-primary',
        soft: 'border-primary/25 bg-primary/5',
        solid: 'bg-primary text-primary-foreground',
        pill: 'bg-primary/10 text-primary ring-primary/20',
    },
    violet: {
        chip: 'bg-violet-500/10 text-violet-600 dark:text-violet-300',
        text: 'text-violet-600 dark:text-violet-300',
        bar: 'bg-violet-500',
        soft: 'border-violet-500/25 bg-violet-500/5',
        solid: 'bg-violet-600 text-white',
        pill: 'bg-violet-500/10 text-violet-700 ring-violet-500/20 dark:text-violet-300',
    },
    emerald: {
        chip: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
        text: 'text-emerald-600 dark:text-emerald-400',
        bar: 'bg-emerald-500',
        soft: 'border-emerald-500/25 bg-emerald-500/5',
        solid: 'bg-emerald-600 text-white',
        pill: 'bg-emerald-500/10 text-emerald-700 ring-emerald-500/20 dark:text-emerald-400',
    },
    amber: {
        chip: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
        text: 'text-amber-600 dark:text-amber-400',
        bar: 'bg-amber-500',
        soft: 'border-amber-500/25 bg-amber-500/5',
        solid: 'bg-amber-500 text-white',
        pill: 'bg-amber-500/10 text-amber-700 ring-amber-500/20 dark:text-amber-400',
    },
    rose: {
        chip: 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
        text: 'text-rose-600 dark:text-rose-400',
        bar: 'bg-rose-500',
        soft: 'border-rose-500/25 bg-rose-500/5',
        solid: 'bg-rose-600 text-white',
        pill: 'bg-rose-500/10 text-rose-700 ring-rose-500/20 dark:text-rose-400',
    },
    sky: {
        chip: 'bg-sky-500/10 text-sky-600 dark:text-sky-400',
        text: 'text-sky-600 dark:text-sky-400',
        bar: 'bg-sky-500',
        soft: 'border-sky-500/25 bg-sky-500/5',
        solid: 'bg-sky-600 text-white',
        pill: 'bg-sky-500/10 text-sky-700 ring-sky-500/20 dark:text-sky-400',
    },
    slate: {
        chip: 'bg-slate-500/10 text-slate-600 dark:text-slate-300',
        text: 'text-slate-600 dark:text-slate-300',
        bar: 'bg-slate-400',
        soft: 'border-slate-500/25 bg-slate-500/5',
        solid: 'bg-slate-600 text-white',
        pill: 'bg-slate-500/10 text-slate-700 ring-slate-500/20 dark:text-slate-300',
    },
};
