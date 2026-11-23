import { Head, Link, usePage } from '@inertiajs/react';
import { AlertTriangle, ArrowRight, Code2, Plus, Power, PowerOff, ShieldCheck, Users, type LucideIcon } from 'lucide-react';
import { useState } from 'react';
import EmptyState from '@/components/empty-state';
import Pill from '@/components/pill';
import PendingInvitationsModal from '@/components/pending-invitations-modal';
import StatCard from '@/components/stat-card';
import { TONE, type Tone } from '@/components/tone';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { dashboard } from '@/routes';
import { index as adminUsersIndex } from '@/routes/admin/users';
import { create as widgetCreate, edit as widgetEdit, index as widgetsIndex } from '@/routes/widgets';
import type { DashboardInvitation } from '@/types';

type RecentWidget = {
    id: number;
    name: string;
    isActive: boolean;
    updatedAt: string | null;
    primaryColor?: string;
};

type Props = {
    pendingInvitations?: DashboardInvitation[];
    widgetStats?: {
        total: number;
        live: number;
        off: number;
        accountSuspended: boolean;
    };
    recentWidgets?: RecentWidget[];
};

export default function Dashboard({ pendingInvitations = [], widgetStats, recentWidgets = [] }: Props) {
    const { auth } = usePage<{ auth: { user: { name: string; is_admin?: boolean } } }>().props;
    const [showInvitations, setShowInvitations] = useState(pendingInvitations.length > 0);
    const stats = widgetStats ?? { total: 0, live: 0, off: 0, accountSuspended: false };
    const firstName = auth.user.name.split(' ')[0];
    const livePercent = stats.total > 0 ? Math.round((stats.live / stats.total) * 100) : 0;

    return (
        <>
            <Head title="Dashboard" />
            <PendingInvitationsModal
                invitations={pendingInvitations}
                open={pendingInvitations.length > 0 && showInvitations}
                onOpenChange={setShowInvitations}
            />

            <div className="flex flex-col gap-6 p-4 md:p-6">
                <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-600 via-primary to-sky-500 p-6 text-white shadow-lg shadow-primary/20 md:p-8">
                    <div className="relative z-10 flex flex-wrap items-center justify-between gap-6">
                        <div className="max-w-xl">
                            <Pill tone="emerald" dot>
                                {stats.live} widget{stats.live === 1 ? '' : 's'} live
                            </Pill>
                            <h1 className="mt-4 text-2xl font-bold tracking-tight md:text-3xl">Hi {firstName}, let's make the web easier for everyone.</h1>
                            <p className="mt-2 text-sm text-white/85">
                                Create a toolbar for each site you run, copy one script line, and your visitors get text, colour and reading tools in one click.
                            </p>
                            <div className="mt-5 flex flex-wrap gap-3">
                                <Button asChild className="bg-white text-violet-700 hover:bg-white/90">
                                    <Link href={widgetCreate.url()}>
                                        <Plus /> New widget
                                    </Link>
                                </Button>
                                <Button asChild variant="outline" className="border-white/40 bg-white/10 text-white hover:bg-white/20 hover:text-white">
                                    <Link href={widgetsIndex.url()}>
                                        Manage widgets <ArrowRight />
                                    </Link>
                                </Button>
                            </div>
                        </div>
                        <div className="hidden size-36 items-center justify-center rounded-3xl bg-white/15 ring-1 ring-white/25 backdrop-blur md:flex" aria-hidden="true">
                            <Code2 className="size-16" />
                        </div>
                    </div>
                    <div className="pointer-events-none absolute -top-16 -right-16 size-64 rounded-full bg-white/10" aria-hidden="true" />
                    <div className="pointer-events-none absolute -bottom-24 left-1/3 size-72 rounded-full bg-sky-300/20 blur-3xl" aria-hidden="true" />
                </section>

                {stats.accountSuspended && (
                    <div className="flex items-start gap-3 rounded-2xl border border-rose-500/30 bg-rose-500/5 p-4 text-sm">
                        <AlertTriangle className="mt-0.5 size-5 shrink-0 text-rose-500" />
                        <div>
                            <p className="font-semibold text-rose-700 dark:text-rose-400">Your account is suspended</p>
                            <p className="text-muted-foreground">Your widgets are not shown to visitors until the account is restored.</p>
                        </div>
                    </div>
                )}

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <StatCard label="Widgets" value={stats.total} hint="Toolbars you have created" icon={Code2} tone="violet" />
                    <StatCard label="Live" value={stats.live} hint={`${livePercent}% of your widgets are showing`} icon={Power} tone="emerald" progress={livePercent} />
                    <StatCard label="Switched off" value={stats.off} hint="Paused, not deleted" icon={PowerOff} tone="amber" />
                    <StatCard
                        label="Account"
                        value={stats.accountSuspended ? 'Suspended' : 'Active'}
                        hint={auth.user.is_admin ? 'Administrator' : 'In good standing'}
                        icon={ShieldCheck}
                        tone={stats.accountSuspended ? 'rose' : 'sky'}
                    />
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    <QuickAction href={widgetCreate.url()} title="Create a widget" text="Design a new toolbar" icon={Plus} tone="violet" />
                    <QuickAction href={widgetsIndex.url()} title="Your widgets" text="Edit, preview or copy scripts" icon={Code2} tone="sky" />
                    {auth.user.is_admin ? (
                        <QuickAction href={adminUsersIndex.url()} title="Manage users" text="Review accounts and access" icon={Users} tone="amber" />
                    ) : (
                        <QuickAction href={widgetsIndex.url()} title="Install guide" text="Paste one line on your site" icon={ArrowRight} tone="emerald" />
                    )}
                </div>

                <div className="grid gap-6 xl:grid-cols-3">
                    <Card className="xl:col-span-2">
                        <CardHeader className="flex-row items-center justify-between space-y-0">
                            <div>
                                <CardTitle>Recent widgets</CardTitle>
                                <CardDescription>The toolbars you changed most recently.</CardDescription>
                            </div>
                            <Button asChild variant="ghost" size="sm">
                                <Link href={widgetsIndex.url()}>
                                    View all <ArrowRight />
                                </Link>
                            </Button>
                        </CardHeader>
                        <CardContent>
                            {recentWidgets.length === 0 ? (
                                <EmptyState
                                    icon={Code2}
                                    tone="violet"
                                    title="No widgets yet"
                                    description="Create your first widget, then copy its script line onto your site."
                                    action={
                                        <Button asChild className="border-0 bg-gradient-to-r from-violet-600 to-sky-500 text-white hover:opacity-95">
                                            <Link href={widgetCreate.url()}>
                                                <Plus /> Create your first widget
                                            </Link>
                                        </Button>
                                    }
                                />
                            ) : (
                                <ul className="divide-y">
                                    {recentWidgets.map((widget) => (
                                        <li key={widget.id}>
                                            <Link
                                                href={widgetEdit.url({ widget: widget.id })}
                                                className="flex items-center justify-between gap-4 rounded-xl px-2 py-3 transition-colors hover:bg-muted/60"
                                            >
                                                <div className="flex min-w-0 items-center gap-3">
                                                    <span className="flex size-9 shrink-0 items-center justify-center rounded-xl text-white" style={{ backgroundColor: widget.primaryColor ?? '#1663d7' }}>
                                                        <Code2 className="size-4" />
                                                    </span>
                                                    <div className="min-w-0">
                                                        <p className="truncate font-medium">{widget.name}</p>
                                                        <p className="text-xs text-muted-foreground">Updated {widget.updatedAt ?? 'just now'}</p>
                                                    </div>
                                                </div>
                                                <Pill tone={widget.isActive ? 'emerald' : 'slate'} dot>
                                                    {widget.isActive ? 'Live' : 'Off'}
                                                </Pill>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Get started</CardTitle>
                            <CardDescription>Three steps to your first toolbar.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-4">
                            {(
                                [
                                    ['Create a widget', 'Choose your brand colours, position and tools.', 'violet'],
                                    ['Copy the script line', 'Open the widget and press Copy script line.', 'sky'],
                                    ['Paste it on your site', 'Add it just before the closing body tag.', 'emerald'],
                                ] as [string, string, Tone][]
                            ).map(([title, text, tone], index) => (
                                <div key={title} className="flex gap-3">
                                    <span className={`flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${TONE[tone].solid}`}>
                                        {index + 1}
                                    </span>
                                    <div>
                                        <p className="font-medium">{title}</p>
                                        <p className="text-sm text-muted-foreground">{text}</p>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}

function QuickAction({ href, title, text, icon: Icon, tone }: { href: string; title: string; text: string; icon: LucideIcon; tone: Tone }) {
    return (
        <Link href={href} className={`group flex items-center gap-4 rounded-2xl border p-4 transition-all hover:-translate-y-0.5 hover:shadow-md ${TONE[tone].soft}`}>
            <span className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${TONE[tone].solid}`}>
                <Icon className="size-5" />
            </span>
            <span className="min-w-0 flex-1">
                <span className="block font-semibold">{title}</span>
                <span className="block truncate text-sm text-muted-foreground">{text}</span>
            </span>
            <ArrowRight className={`size-4 transition-transform group-hover:translate-x-0.5 ${TONE[tone].text}`} />
        </Link>
    );
}

Dashboard.layout = (props: { currentTeam?: { slug: string } | null }) => ({
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: props.currentTeam ? dashboard(props.currentTeam.slug) : '/',
        },
    ],
});
