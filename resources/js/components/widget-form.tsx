import { useForm } from '@inertiajs/react';
import {
    AlignJustify,
    AlignLeft,
    BookOpen,
    Check,
    Contrast,
    Copy,
    Droplet,
    Eye,
    EyeOff,
    Focus,
    Heading1,
    Highlighter,
    ImageOff,
    Keyboard,
    Layers,
    Link as LinkIcon,
    ListTree,
    Loader2,
    Mic,
    Minus,
    Moon,
    MousePointer2,
    MoveHorizontal,
    Palette,
    PauseCircle,
    Shield,
    Sparkles,
    Type,
    Volume2,
    VolumeX,
    ZoomIn,
    type LucideIcon,
} from 'lucide-react';
import { useState, type FormEvent, type ReactNode } from 'react';
import { TONE, type Tone } from '@/components/tone';
import { Button } from '@/components/ui/button';
import { preview as widgetPreview, store as widgetStore, update as widgetUpdate } from '@/routes/widgets';

export type WidgetSettings = {
    brandName: string;
    primaryColor: string;
    textColor: string;
    highlightColor: string;
    position: string;
    offset: number;
    uiLanguage: string;
    language: string;
    statementUrl: string;
    features: Record<string, boolean>;
};

export type WidgetFormData = {
    name: string;
    isActive: boolean;
    settings: WidgetSettings;
};

type Props = {
    widgetId?: number;
    snippet?: string;
    initial: WidgetFormData;
    languages: string[];
    positions: string[];
    features: string[];
};

const FEATURE_META: Record<string, { label: string; icon: LucideIcon }> = {
    textSize: { label: 'Text size', icon: Type },
    lineHeight: { label: 'Line height', icon: AlignJustify },
    spacing: { label: 'Text spacing', icon: MoveHorizontal },
    align: { label: 'Text alignment', icon: AlignLeft },
    dyslexia: { label: 'Dyslexia font', icon: BookOpen },
    dictionary: { label: 'Dictionary', icon: BookOpen },
    textToSpeech: { label: 'Text reader', icon: Volume2 },
    contrast: { label: 'High contrast', icon: Contrast },
    darkMode: { label: 'Smart dark mode', icon: Moon },
    saturation: { label: 'Saturation', icon: Droplet },
    colorFilter: { label: 'Colour-blind filters', icon: Eye },
    hideImages: { label: 'Hide images', icon: ImageOff },
    hideDistractions: { label: 'Hide distractions', icon: EyeOff },
    pauseAnimations: { label: 'Stop animations', icon: PauseCircle },
    focusIndicator: { label: 'Focus indicator', icon: Focus },
    bigCursor: { label: 'Big cursor', icon: MousePointer2 },
    magnifier: { label: 'Text magnifier', icon: ZoomIn },
    customColors: { label: 'Custom colours', icon: Palette },
    highlightLinks: { label: 'Highlight links', icon: LinkIcon },
    highlightHeadings: { label: 'Highlight headers', icon: Heading1 },
    highlightHover: { label: 'Highlight on hover', icon: Highlighter },
    readingGuide: { label: 'Reading guide', icon: Minus },
    readingMask: { label: 'Reading mask', icon: Layers },
    pageStructure: { label: 'Page navigator', icon: ListTree },
    keyboard: { label: 'Virtual keyboard', icon: Keyboard },
    muteSounds: { label: 'Mute sounds', icon: VolumeX },
    voiceControl: { label: 'Voice control', icon: Mic },
    profiles: { label: 'Smart profiles', icon: Sparkles },
    statement: { label: 'Statement link', icon: Shield },
};

const TOOL_GROUPS: { title: string; keys: string[] }[] = [
    { title: 'Text and reading', keys: ['textSize', 'lineHeight', 'spacing', 'align', 'dyslexia', 'dictionary', 'textToSpeech'] },
    { title: 'Colour and vision', keys: ['contrast', 'darkMode', 'saturation', 'colorFilter', 'hideImages', 'hideDistractions', 'pauseAnimations', 'focusIndicator', 'bigCursor', 'magnifier', 'customColors'] },
    { title: 'Navigation and tools', keys: ['highlightLinks', 'highlightHeadings', 'highlightHover', 'readingGuide', 'readingMask', 'pageStructure', 'keyboard', 'muteSounds', 'voiceControl', 'profiles', 'statement'] },
];

const GROUP_TONES: Tone[] = ['sky', 'violet', 'emerald'];

const LANGUAGE_NAMES: Record<string, string> = {
    en: 'English', es: 'Español', fr: 'Français', de: 'Deutsch', pt: 'Português', it: 'Italiano', nl: 'Nederlands',
    pl: 'Polski', sv: 'Svenska', da: 'Dansk', fi: 'Suomi', el: 'Ελληνικά', bn: 'বাংলা',
};

const POSITION_NAMES: Record<string, string> = {
    'top-left': 'Top left', 'top-right': 'Top right', 'middle-left': 'Middle left',
    'middle-right': 'Middle right', 'bottom-left': 'Bottom left', 'bottom-right': 'Bottom right',
};

const inputClass =
    'h-10 w-full rounded-xl border border-input bg-background px-3 text-sm shadow-xs transition focus-visible:border-ring focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50';

export default function WidgetForm({ widgetId, snippet, initial, languages, positions, features }: Props) {
    const form = useForm<WidgetFormData>(initial);
    const [copied, setCopied] = useState(false);
    const isEditing = widgetId !== undefined;
    const settings = form.data.settings;

    function setSetting<K extends keyof WidgetSettings>(key: K, value: WidgetSettings[K]) {
        form.setData('settings', { ...settings, [key]: value });
    }

    function setFeature(feature: string, enabled: boolean) {
        form.setData('settings', { ...settings, features: { ...settings.features, [feature]: enabled } });
    }

    function enableAll(enabled: boolean) {
        const next = Object.fromEntries(features.map((feature) => [feature, enabled]));
        form.setData('settings', { ...settings, features: next });
    }

    function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (widgetId !== undefined) {
            form.patch(widgetUpdate.url({ widget: widgetId }), { preserveScroll: true });

            return;
        }

        form.post(widgetStore.url());
    }

    function copySnippet() {
        if (!snippet) {
            return;
        }

        navigator.clipboard?.writeText(snippet);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    }

    const enabledCount = features.filter((feature) => settings.features[feature] ?? true).length;

    return (
        <form onSubmit={submit} className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
            <div className="grid content-start gap-6">
                <Section icon={Sparkles} tone="sky" title="Basics" description="The name is for you. Visitors never see it.">
                    <div className="grid gap-4 md:grid-cols-2">
                        <Field label="Widget name" htmlFor="name" error={form.errors.name}>
                            <input id="name" className={inputClass} value={form.data.name} maxLength={100} required onChange={(event) => form.setData('name', event.target.value)} />
                        </Field>
                        <Field label="Status">
                            <label className="flex h-10 cursor-pointer items-center justify-between rounded-xl border px-3 text-sm">
                                <span>{form.data.isActive ? 'Live on your site' : 'Switched off'}</span>
                                <Toggle checked={form.data.isActive} onChange={(checked) => form.setData('isActive', checked)} label="Switched on" />
                            </label>
                        </Field>
                    </div>
                </Section>

                <Section icon={Palette} tone="violet" title="Look" description="Brand name, colours and the floating button.">
                    <div className="grid gap-5">
                        <Field label="Brand name in the menu" htmlFor="brandName" error={form.errors['settings.brandName']}>
                            <input id="brandName" className={inputClass} maxLength={60} required value={settings.brandName} onChange={(event) => setSetting('brandName', event.target.value)} />
                        </Field>

                        <div className="grid gap-3 sm:grid-cols-3">
                            <ColourSwatch label="Brand" value={settings.primaryColor} onChange={(value) => setSetting('primaryColor', value)} />
                            <ColourSwatch label="Icon" value={settings.textColor} onChange={(value) => setSetting('textColor', value)} />
                            <ColourSwatch label="Highlight" value={settings.highlightColor} onChange={(value) => setSetting('highlightColor', value)} />
                        </div>

                        <Field label="Button position">
                            <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
                                {positions.map((position) => {
                                    const selected = settings.position === position;

                                    return (
                                        <button
                                            key={position}
                                            type="button"
                                            aria-pressed={selected}
                                            onClick={() => setSetting('position', position)}
                                            className={`group relative flex flex-col items-center gap-2 rounded-xl border p-3 text-xs transition ${
                                                selected ? 'border-primary bg-primary/5 text-primary ring-2 ring-primary/20' : 'hover:border-primary/40'
                                            }`}
                                        >
                                            <span className="relative block h-9 w-12 rounded-md border bg-background">
                                                <span className={`absolute size-2.5 rounded-full ${dotPosition(position)} ${selected ? 'bg-primary' : 'bg-muted-foreground/40'}`} />
                                            </span>
                                            <span className="text-center leading-tight">{POSITION_NAMES[position] ?? position}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </Field>

                        <Field label="Distance from the edge (px)" htmlFor="offset" error={form.errors['settings.offset']}>
                            <input id="offset" type="number" min={0} max={200} className={`${inputClass} max-w-40`} value={settings.offset} onChange={(event) => setSetting('offset', Number(event.target.value))} />
                        </Field>
                    </div>
                </Section>

                <Section icon={Shield} tone="emerald" title="Language and links" description="The menu language and your accessibility statement.">
                    <div className="grid gap-4 md:grid-cols-2">
                        <Field label="Menu language" htmlFor="uiLanguage">
                            <select id="uiLanguage" className={inputClass} value={settings.uiLanguage} onChange={(event) => setSetting('uiLanguage', event.target.value)}>
                                <option value="">Match the page language</option>
                                {languages.map((code) => (
                                    <option key={code} value={code}>{LANGUAGE_NAMES[code] ?? code}</option>
                                ))}
                            </select>
                        </Field>
                        <Field label="Page language code" htmlFor="language">
                            <input id="language" className={inputClass} maxLength={5} value={settings.language} onChange={(event) => setSetting('language', event.target.value)} />
                        </Field>
                    </div>
                    <div className="mt-4">
                        <Field label="Accessibility statement URL (optional)" htmlFor="statementUrl" error={form.errors['settings.statementUrl']}>
                            <input id="statementUrl" type="url" placeholder="https://yoursite.com/accessibility" className={inputClass} value={settings.statementUrl} onChange={(event) => setSetting('statementUrl', event.target.value)} />
                        </Field>
                    </div>
                </Section>

                <Section
                    icon={Check}
                    tone="rose"
                    title="Tools"
                    description={`${enabledCount} of ${features.length} tools are on. Switch off any tool you don't want visitors to have.`}
                    action={
                        <div className="flex gap-2">
                            <Button type="button" size="sm" variant="ghost" onClick={() => enableAll(true)}>All on</Button>
                            <Button type="button" size="sm" variant="ghost" onClick={() => enableAll(false)}>All off</Button>
                        </div>
                    }
                >
                    <div className="grid gap-6">
                        {TOOL_GROUPS.map((group, groupIndex) => {
                            const groupKeys = group.keys.filter((key) => features.includes(key));
                            const tone = GROUP_TONES[groupIndex];

                            return (
                                <div key={group.title}>
                                    <p className={`mb-2 flex items-center gap-2 text-xs font-semibold tracking-wider uppercase ${TONE[tone].text}`}>
                                        <span className={`size-2 rounded-full ${TONE[tone].bar}`} aria-hidden="true" />
                                        {group.title}
                                    </p>
                                    <div className="grid gap-2 sm:grid-cols-2">
                                        {groupKeys.map((feature) => {
                                            const meta = FEATURE_META[feature] ?? { label: feature, icon: Check };
                                            const enabled = settings.features[feature] ?? true;
                                            const Icon = meta.icon;

                                            return (
                                                <button
                                                    key={feature}
                                                    type="button"
                                                    role="switch"
                                                    aria-checked={enabled}
                                                    onClick={() => setFeature(feature, !enabled)}
                                                    className={`flex items-center gap-3 rounded-xl border p-3 text-left text-sm transition ${
                                                        enabled ? TONE[tone].soft : 'opacity-70 hover:opacity-100'
                                                    }`}
                                                >
                                                    <span className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${enabled ? TONE[tone].solid : 'bg-muted text-muted-foreground'}`}>
                                                        <Icon className="size-4" />
                                                    </span>
                                                    <span className="flex-1 font-medium">{meta.label}</span>
                                                    <Toggle checked={enabled} label={meta.label} decorative />
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </Section>

                <div className="sticky bottom-4 z-10 flex items-center justify-between gap-3 rounded-2xl border bg-background/90 p-3 shadow-lg backdrop-blur">
                    <span className="px-2 text-sm text-muted-foreground">
                        {form.recentlySuccessful ? (
                            <span className="font-medium text-emerald-600">All changes saved</span>
                        ) : form.isDirty ? (
                            'You have unsaved changes'
                        ) : (
                            'No unsaved changes'
                        )}
                    </span>
                    <Button type="submit" disabled={form.processing} size="lg" className="border-0 bg-gradient-to-r from-violet-600 via-primary to-sky-500 text-white shadow-lg shadow-primary/25 hover:opacity-95">
                        {form.processing && <Loader2 className="animate-spin" />}
                        {isEditing ? 'Save changes' : 'Create widget'}
                    </Button>
                </div>
            </div>

            {isEditing && (
                <aside className="grid content-start gap-6 xl:sticky xl:top-6 xl:self-start">
                    <div className="overflow-hidden rounded-2xl border bg-card shadow-xs">
                        <div className="flex items-center justify-between border-b px-5 py-4">
                            <div>
                                <p className="font-semibold">Live preview</p>
                                <p className="text-xs text-muted-foreground">Uses the saved settings</p>
                            </div>
                            <a href={widgetPreview.url({ widget: widgetId })} target="_blank" rel="noreferrer" className="text-sm font-medium text-primary hover:underline">
                                Open
                            </a>
                        </div>
                        <iframe title="Widget preview" src={widgetPreview.url({ widget: widgetId })} className="h-[440px] w-full bg-background" />
                    </div>

                    <div className="rounded-2xl border bg-card p-5 shadow-xs">
                        <p className="font-semibold">Install script</p>
                        <p className="mt-1 text-sm text-muted-foreground">Paste this one line just before the closing body tag on your site.</p>
                        <div className="mt-4 rounded-xl bg-slate-950 p-3">
                            <code className="block font-mono text-[11px] leading-5 break-all text-slate-200">{snippet}</code>
                        </div>
                        <Button type="button" variant="outline" className="mt-4 w-full" onClick={copySnippet}>
                            {copied ? <Check /> : <Copy />} {copied ? 'Copied' : 'Copy script line'}
                        </Button>
                    </div>
                </aside>
            )}
        </form>
    );
}

function dotPosition(position: string): string {
    const vertical = position.startsWith('top') ? 'top-1' : position.startsWith('middle') ? 'top-1/2 -translate-y-1/2' : 'bottom-1';
    const horizontal = position.endsWith('left') ? 'left-1' : 'right-1';

    return `${vertical} ${horizontal}`;
}

function Section({ icon: Icon, tone, title, description, action, children }: { icon: LucideIcon; tone: Tone; title: string; description: string; action?: ReactNode; children: ReactNode }) {
    return (
        <section className="rounded-2xl border bg-card p-5 shadow-xs md:p-6">
            <div className="mb-5 flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                    <span className={`flex size-10 shrink-0 items-center justify-center rounded-xl ring-1 ring-inset ring-current/10 ${TONE[tone].chip}`}>
                        <Icon className="size-5" />
                    </span>
                    <div>
                        <h2 className="font-semibold">{title}</h2>
                        <p className="text-sm text-muted-foreground">{description}</p>
                    </div>
                </div>
                {action}
            </div>
            {children}
        </section>
    );
}

function Field({ label, htmlFor, error, children }: { label: string; htmlFor?: string; error?: string; children: ReactNode }) {
    return (
        <div className="grid gap-2">
            <label htmlFor={htmlFor} className="text-sm font-medium">{label}</label>
            {children}
            {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
    );
}

function ColourSwatch({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
    return (
        <label className="flex cursor-pointer items-center gap-3 rounded-xl border p-3">
            <span className="relative size-10 shrink-0 overflow-hidden rounded-full ring-1 ring-black/10" style={{ backgroundColor: value }}>
                <input type="color" aria-label={`${label} colour`} value={value} onChange={(event) => onChange(event.target.value)} className="absolute inset-0 size-full cursor-pointer opacity-0" />
            </span>
            <span>
                <span className="block text-sm font-medium">{label}</span>
                <span className="font-mono text-xs text-muted-foreground uppercase">{value}</span>
            </span>
        </label>
    );
}

function Toggle({ checked, onChange, label, decorative = false }: { checked: boolean; onChange?: (checked: boolean) => void; label: string; decorative?: boolean }) {
    return (
        <span className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition ${checked ? 'bg-primary' : 'bg-muted-foreground/30'}`}>
            {decorative ? null : (
                <input
                    type="checkbox"
                    aria-label={label}
                    checked={checked}
                    onChange={(event) => onChange?.(event.target.checked)}
                    className="absolute inset-0 size-full cursor-pointer opacity-0"
                />
            )}
            <span className={`block size-5 rounded-full bg-white shadow transition ${checked ? 'translate-x-5' : 'translate-x-0.5'}`} />
        </span>
    );
}
