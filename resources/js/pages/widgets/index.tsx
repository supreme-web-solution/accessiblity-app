import { Head, Link, router, usePage } from '@inertiajs/react';
import { ArrowRight, Code2, Eye, Pencil, Plus, Power, PowerOff, Trash2 } from 'lucide-react';
import EmptyState from '@/components/empty-state';
import PageHeader from '@/components/page-header';
import Pill from '@/components/pill';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { create as widgetCreate, destroy as widgetDestroy, edit as widgetEdit, index as widgetsIndex, preview as widgetPreview } from '@/routes/widgets';

type WidgetSummary = {
    id: number;
    name: string;
    key: string;
    isActive: boolean;
    snippet: string;
    updatedAt: string | null;
    settings?: { primaryColor?: string };
};

type Props = {
    widgets: WidgetSummary[];
};

const GRADIENT_BUTTON = 'border-0 bg-gradient-to-r from-violet-600 via-primary to-sky-500 text-white shadow-lg shadow-primary/25 hover:opacity-95';

export default function WidgetsIndex({ widgets }: Props) {
    const { flash } = usePage<{ flash?: { status?: string } }>().props;

    function deleteWidget(widget: WidgetSummary) {
        if (!window.confirm(`Delete "${widget.name}"? Its script line will stop working on your site.`)) {
            return;
        }

        router.delete(widgetDestroy.url({ widget: widget.id }));
    }

    return (
        <>
            <Head title="Widgets" />

            <div className="flex flex-col gap-6 p-4 md:p-6">
                <PageHeader
                    eyebrow="Widgets"
                    title="Your toolbars"
                    description="Each widget has its own look and tools, and one script line for your site."
                    actions={
                        <Button asChild className={GRADIENT_BUTTON}>
                            <Link href={widgetCreate.url()}>
                                <Plus /> New widget
                            </Link>
                        </Button>
                    }
                />

                {flash?.status && (
                    <p role="status" className="rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm">
                        {flash.status}
                    </p>
                )}

                {widgets.length === 0 ? (
                    <EmptyState
                        icon={Code2}
                        tone="violet"
                        title="No widgets yet"
                        description="Create your first toolbar. It takes about a minute, and you get one script line to paste on your site."
                        action={
                            <Button asChild size="lg" className={GRADIENT_BUTTON}>
                                <Link href={widgetCreate.url()}>
                                    <Plus /> Create a widget
                                </Link>
                            </Button>
                        }
                    />
                ) : (
                    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                        {widgets.map((widget) => {
                            const brand = widget.settings?.primaryColor ?? '#1663d7';

                            return (
                                <Card key={widget.id} className="group relative flex flex-col overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-lg">
                                    <div className="h-1.5 w-full" style={{ background: `linear-gradient(90deg, ${brand}, ${brand}55)` }} aria-hidden="true" />

                                    <div className="flex items-start justify-between gap-3 p-5 pb-3">
                                        <div className="flex min-w-0 items-center gap-3">
                                            <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl text-white shadow-md" style={{ backgroundColor: brand }}>
                                                <Code2 className="size-5" />
                                            </span>
                                            <div className="min-w-0">
                                                <Link href={widgetEdit.url({ widget: widget.id })} className="block truncate font-semibold hover:underline">
                                                    {widget.name}
                                                </Link>
                                                <p className="text-xs text-muted-foreground">Updated {widget.updatedAt ?? 'just now'}</p>
                                            </div>
                                        </div>
                                        <Pill tone={widget.isActive ? 'emerald' : 'slate'} dot>
                                            {widget.isActive ? (
                                                <>
                                                    <Power className="size-3" /> Live
                                                </>
                                            ) : (
                                                <>
                                                    <PowerOff className="size-3" /> Off
                                                </>
                                            )}
                                        </Pill>
                                    </div>

                                    <div className="mx-5 rounded-xl border border-dashed bg-muted/40 px-3 py-2">
                                        <code className="block truncate font-mono text-[11px] text-muted-foreground">{widget.snippet}</code>
                                    </div>

                                    <div className="mt-auto flex items-center justify-between gap-2 p-5 pt-4">
                                        <Button asChild size="sm" className="border-0 text-white shadow-md" style={{ backgroundColor: brand }}>
                                            <Link href={widgetEdit.url({ widget: widget.id })}>
                                                <Pencil /> Edit
                                            </Link>
                                        </Button>
                                        <div className="flex items-center gap-1">
                                            <Button asChild size="icon" variant="ghost" aria-label={`Preview ${widget.name}`} title="Preview" className="text-sky-600 hover:bg-sky-500/10 hover:text-sky-600 dark:text-sky-400">
                                                <a href={widgetPreview.url({ widget: widget.id })} target="_blank" rel="noreferrer">
                                                    <Eye />
                                                </a>
                                            </Button>
                                            <Button size="icon" variant="ghost" aria-label={`Delete ${widget.name}`} title="Delete" onClick={() => deleteWidget(widget)} className="text-rose-600 hover:bg-rose-500/10 hover:text-rose-600 dark:text-rose-400">
                                                <Trash2 />
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            );
                        })}
                    </div>
                )}

                {widgets.length > 0 && (
                    <p className="text-center text-sm text-muted-foreground">
                        Need a new toolbar?{' '}
                        <Link href={widgetCreate.url()} className="inline-flex items-center gap-1 font-medium text-primary hover:underline">
                            Create another <ArrowRight className="size-3.5" />
                        </Link>
                    </p>
                )}
            </div>
        </>
    );
}

WidgetsIndex.layout = {
    breadcrumbs: [
        {
            title: 'Widgets',
            href: widgetsIndex.url(),
        },
    ],
};
