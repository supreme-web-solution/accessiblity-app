import type { ReactNode } from 'react';
import { TONE, type Tone } from '@/components/tone';

type Props = {
    tone?: Tone;
    dot?: boolean;
    children: ReactNode;
};

/** A coloured status badge with an optional dot. */
export default function Pill({ tone = 'slate', dot = false, children }: Props) {
    return (
        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${TONE[tone].pill}`}>
            {dot && <span className={`size-1.5 rounded-full ${TONE[tone].bar}`} aria-hidden="true" />}
            {children}
        </span>
    );
}
