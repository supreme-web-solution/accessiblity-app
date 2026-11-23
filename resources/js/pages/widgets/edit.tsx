import { Head, Link, usePage } from '@inertiajs/react';
import { ChevronLeft, ShieldAlert } from 'lucide-react';
import PageHeader from '@/components/page-header';
import WidgetForm, { type WidgetFormData } from '@/components/widget-form';
import Pill from '@/components/pill';
import { Button } from '@/components/ui/button';
import { edit as widgetEdit, index as widgetsIndex } from '@/routes/widgets';

type Props = {
    widget: {
        id: number;
        name: string;
        key: string;
        isActive: boolean;
        settings: WidgetFormData['settings'];
        snippet: string;
        updatedAt: string | null;
    };
    languages: string[];
    positions: string[];
    features: string[];
    isSuspended: boolean;
};

export default function WidgetEdit({ widget, languages, positions, features, isSuspended }: Props) {
    const { flash } = usePage<{ flash?: { status?: string } }>().props;
    const initial: WidgetFormData = {
        name: widget.name,
        isActive: widget.isActive,
        settings: widget.settings,
    };

    return (
        <>
            <Head title={widget.name} />

            <div className="flex flex-col gap-6 p-4 md:p-6">
                <PageHeader
                    eyebrow={widget.isActive ? 'Live' : 'Switched off'}
                    title={widget.name}
                    description={`Last saved ${widget.updatedAt ?? 'just now'}. Changes reach visitors within a few minutes.`}
                    actions={
                        <>
                            <Pill tone={widget.isActive ? 'emerald' : 'slate'} dot>
                                {widget.isActive ? 'Live' : 'Off'}
                            </Pill>
                            <Button asChild variant="ghost">
                                <Link href={widgetsIndex.url()}>
                                    <ChevronLeft /> All widgets
                                </Link>
                            </Button>
                        </>
                    }
                />

                {isSuspended && (
                    <div className="flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm">
                        <ShieldAlert className="mt-0.5 size-5 shrink-0 text-destructive" />
                        <div>
                            <p className="font-semibold">Your account is suspended</p>
                            <p className="text-muted-foreground">This widget is not shown to visitors until your account is restored.</p>
                        </div>
                    </div>
                )}

                {flash?.status && (
                    <p role="status" className="rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm">
                        {flash.status}
                    </p>
                )}

                <WidgetForm
                    widgetId={widget.id}
                    snippet={widget.snippet}
                    initial={initial}
                    languages={languages}
                    positions={positions}
                    features={features}
                />
            </div>
        </>
    );
}

WidgetEdit.layout = (props: { widget: { id: number; name: string } }) => ({
    breadcrumbs: [
        { title: 'Widgets', href: widgetsIndex.url() },
        { title: props.widget.name, href: widgetEdit.url({ widget: props.widget.id }) },
    ],
});
