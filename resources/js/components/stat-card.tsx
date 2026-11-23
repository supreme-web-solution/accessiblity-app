import type { LucideIcon } from 'lucide-react';
import { TONE, type Tone } from '@/components/tone';

type Props = {
    label: string;
    value: number | string;
    hint?: string;
    icon: LucideIcon;
    tone?: Tone;
    /** Optional 0 to 100 share shown as a coloured bar. */
    progress?: number;
};

export default function StatCard({ label, value, hint, icon: Icon, tone = 'brand', progress }: Props) {
    const colours = TONE[tone] ?? TONE.brand;

    return (
        <div className="group relative overflow-hidden rounded-2xl border bg-card p-5 shadow-xs transition-shadow hover:shadow-md">
            <div className={`pointer-events-none absolute -top-10 -right-10 size-32 rounded-full opacity-20 blur-2xl ${colours.bar}`} aria-hidden="true" />
            <div className="relative flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">{label}</p>
                <span className={`flex size-10 items-center justify-center rounded-xl ring-1 ring-inset ring-current/10 ${colours.chip}`}>
                    <Icon className="size-5" aria-hidden="true" />
                </span>
            </div>
            <p className="relative mt-3 text-3xl font-bold tracking-tight">{value}</p>
            {progress !== undefined && (
                <div className="relative mt-3 h-1.5 overflow-hidden rounded-full bg-muted" role="presentation">
                    <div className={`h-full rounded-full ${colours.bar}`} style={{ width: `${Math.max(0, Math.min(100, progress))}%` }} />
                </div>
            )}
            {hint && <p className="relative mt-2 text-xs text-muted-foreground">{hint}</p>}
        </div>
    );
}
