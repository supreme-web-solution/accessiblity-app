import { Head, Link } from '@inertiajs/react';
import { ChevronLeft, Sparkles } from 'lucide-react';
import PageHeader from '@/components/page-header';
import WidgetForm, { type WidgetFormData, type WidgetSettings } from '@/components/widget-form';
import { Button } from '@/components/ui/button';
import { create as widgetCreate, index as widgetsIndex } from '@/routes/widgets';

type Props = {
    defaults: WidgetSettings;
    languages: string[];
    positions: string[];
    features: string[];
};

export default function WidgetCreate({ defaults, languages, positions, features }: Props) {
    const initial: WidgetFormData = {
        name: '',
        isActive: true,
        settings: defaults,
    };

    return (
        <>
            <Head title="New widget" />

            <div className="flex flex-col gap-6 p-4 md:p-6">
                <PageHeader
                    eyebrow="New widget"
                    title="Design your toolbar"
                    description="Set the look and the tools. After you create it, you'll get the script line to paste on your site."
                    actions={
                        <Button asChild variant="ghost">
                            <Link href={widgetsIndex.url()}>
                                <ChevronLeft /> All widgets
                            </Link>
                        </Button>
                    }
                />
                <div className="flex items-center gap-2 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm">
                    <Sparkles className="size-4 text-primary" />
                    The defaults work well for most sites. You can change any of them later.
                </div>
                <WidgetForm initial={initial} languages={languages} positions={positions} features={features} />
            </div>
        </>
    );
}

WidgetCreate.layout = {
    breadcrumbs: [
        { title: 'Widgets', href: widgetsIndex.url() },
        { title: 'New widget', href: widgetCreate.url() },
    ],
};
