import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { TONE, type Tone } from '@/components/tone';

type Props = {
    icon: LucideIcon;
    title: string;
    description: string;
    action?: ReactNode;
    tone?: Tone;
};

/** A friendly placeholder for lists and pages that have nothing to show yet. */
export default function EmptyState({ icon: Icon, title, description, action, tone = 'violet' }: Props) {
    return (
        <div className="relative isolate overflow-hidden rounded-3xl border border-dashed bg-gradient-to-b from-card to-muted/40 px-6 py-14 text-center">
            <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_1px_1px,theme(colors.slate.400/0.18)_1px,transparent_0)] [background-size:18px_18px]" aria-hidden="true" />
            <div className="relative mx-auto flex max-w-md flex-col items-center gap-4">
                <div className="relative">
                    <span className={`absolute inset-0 -m-3 rounded-full opacity-30 blur-xl ${TONE[tone].bar}`} aria-hidden="true" />
                    <span className={`relative flex size-16 items-center justify-center rounded-3xl bg-gradient-to-br from-violet-600 via-primary to-sky-500 text-white shadow-lg shadow-primary/25`}>
                        <Icon className="size-8" aria-hidden="true" />
                    </span>
                </div>
                <div>
                    <h2 className="text-lg font-bold tracking-tight">{title}</h2>
                    <p className="mt-1 text-sm text-muted-foreground">{description}</p>
                </div>
                {action && <div className="mt-1">{action}</div>}
            </div>
        </div>
    );
}
