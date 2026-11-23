import { Head, Link, usePage } from '@inertiajs/react';
import {
    ArrowRight,
    Check,
    Code2,
    Compass,
    Keyboard,
    Mic,
    Palette,
    Sparkles,
    Type,
    UserPlus,
    Wand2,
    Clipboard,
    Globe,
    type LucideIcon,
} from 'lucide-react';
import AppLogoIcon from '@/components/app-logo-icon';
import Pill from '@/components/pill';
import { dashboard, login } from '@/routes';

type Props = {
    auth: { user: { name: string } | null };
    currentTeam?: { slug: string } | null;
    appUrl: string;
};

const FEATURES: { title: string; text: string; icon: LucideIcon; tone: string }[] = [
    { title: 'Smart profiles', text: 'One click sets up tools for visual, ADHD or cognitive needs.', icon: Sparkles, tone: 'bg-violet-500/10 text-violet-600 dark:text-violet-300' },
    { title: 'Text and reading', text: 'Text size, line height, spacing, alignment, a dyslexia-friendly font and a text reader.', icon: Type, tone: 'bg-sky-500/10 text-sky-600 dark:text-sky-400' },
    { title: 'Colour and contrast', text: 'High contrast, smart dark mode, colour-blind filters, custom colours and a text magnifier.', icon: Palette, tone: 'bg-amber-500/10 text-amber-600 dark:text-amber-400' },
    { title: 'Navigation', text: 'A page navigator, reading guide, reading mask and link and heading highlighting.', icon: Compass, tone: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' },
    { title: 'Virtual keyboard', text: 'An on-screen keyboard that types into the field the visitor last clicked.', icon: Keyboard, tone: 'bg-rose-500/10 text-rose-600 dark:text-rose-400' },
    { title: 'Voice control', text: 'Visitors can speak commands such as "bigger text" or "dark mode" in Chrome and Edge.', icon: Mic, tone: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-300' },
];

const STEPS: { title: string; text: string; icon: LucideIcon }[] = [
    { title: 'Get your login', text: 'Your administrator creates your account and emails you.', icon: UserPlus },
    { title: 'Design your toolbar', text: 'Pick your brand colours, position and tools.', icon: Wand2 },
    { title: 'Copy one line', text: 'Press Copy script line on your widget.', icon: Clipboard },
    { title: 'Paste it on your site', text: 'Add it just before the closing body tag.', icon: Globe },
];

export default function Welcome() {
    const { auth, currentTeam, appUrl } = usePage<Props>().props;
    const dashboardUrl = currentTeam ? dashboard(currentTeam.slug) : '/';

    return (
        <>
            <Head title="ADA Suite - an accessibility toolbar for your website" />

            <div className="min-h-screen bg-background text-foreground antialiased">
                <nav className="sticky top-0 z-20 border-b bg-background/80 backdrop-blur-lg">
                    <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
                        <Link href="/" className="flex items-center gap-2.5 font-extrabold tracking-tight">
                            <AppLogoIcon className="size-8" />
                            <span>ADA Suite</span>
                        </Link>
                        <div className="flex items-center gap-3 text-sm font-semibold">
                            <a href="#features" className="hidden text-muted-foreground hover:text-foreground sm:inline">Features</a>
                            <a href="#how" className="hidden text-muted-foreground hover:text-foreground sm:inline">How it works</a>
                            {auth.user ? (
                                <Link href={dashboardUrl} className="rounded-xl bg-primary px-4 py-2 text-primary-foreground shadow-md shadow-primary/25 hover:opacity-95">
                                    Dashboard
                                </Link>
                            ) : (
                                <Link href={login()} className="rounded-xl bg-gradient-to-r from-violet-600 via-primary to-sky-500 px-4 py-2 text-white shadow-md shadow-primary/25 hover:opacity-95">
                                    Log in
                                </Link>
                            )}
                        </div>
                    </div>
                </nav>

                <header className="relative isolate overflow-hidden">
                    <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(1000px_420px_at_10%_-10%,color-mix(in_srgb,var(--color-primary)_22%,transparent),transparent_70%),radial-gradient(800px_380px_at_100%_0%,color-mix(in_srgb,#ffd400_16%,transparent),transparent_70%)]" aria-hidden="true" />
                    <div className="mx-auto max-w-6xl px-5 pt-20 pb-16 text-center md:pt-24">
                        <Pill tone="violet" dot>Free to start &middot; no installation for visitors</Pill>
                        <h1 className="mx-auto mt-6 max-w-4xl text-4xl leading-[1.08] font-extrabold tracking-tight md:text-6xl">
                            Make your website{' '}
                            <span className="bg-gradient-to-r from-violet-600 via-primary to-sky-500 bg-clip-text text-transparent">easier to use</span>{' '}
                            for everyone
                        </h1>
                        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
                            ADA Suite adds a friendly accessibility menu to your website. Your visitors get text, colour, reading and navigation tools in one click, and you get it running with one line of code.
                        </p>
                        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
                            <Link href={auth.user ? dashboardUrl : login()} className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 via-primary to-sky-500 px-6 py-3.5 font-bold text-white shadow-xl shadow-primary/30 transition hover:-translate-y-0.5">
                                {auth.user ? 'Go to dashboard' : 'Log in to your toolbar'} <ArrowRight className="size-4" />
                            </Link>
                            <a href="#how" className="inline-flex items-center gap-2 rounded-2xl border bg-card px-6 py-3.5 font-bold transition hover:-translate-y-0.5 hover:shadow-md">
                                See how it works
                            </a>
                        </div>
                        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
                            {['No coding needed', '13 languages', 'Works on any website'].map((item) => (
                                <span key={item} className="inline-flex items-center gap-1.5">
                                    <Check className="size-4 text-emerald-500" /> {item}
                                </span>
                            ))}
                        </div>

                        <div className="relative mx-auto mt-16 max-w-4xl" aria-hidden="true">
                            <div className="rounded-3xl border bg-card p-4 shadow-2xl shadow-primary/10">
                                <div className="flex h-[300px] flex-col overflow-hidden rounded-2xl border bg-background">
                                    <div className="flex items-center gap-1.5 border-b px-4 py-2.5">
                                        <span className="size-2.5 rounded-full bg-rose-400" />
                                        <span className="size-2.5 rounded-full bg-amber-400" />
                                        <span className="size-2.5 rounded-full bg-emerald-400" />
                                    </div>
                                    <div className="grid flex-1 gap-3 p-6 md:grid-cols-2">
                                        <div className="space-y-3">
                                            <div className="h-6 w-3/5 rounded-lg bg-gradient-to-r from-violet-500/40 to-sky-500/40" />
                                            <div className="h-3 w-full rounded bg-muted" />
                                            <div className="h-3 w-11/12 rounded bg-muted" />
                                            <div className="h-3 w-4/5 rounded bg-muted" />
                                        </div>
                                        <div className="hidden rounded-2xl border bg-card p-3 shadow-lg md:block">
                                            <p className="mb-2 px-1 text-[10px] font-bold tracking-wider text-muted-foreground uppercase">Accessibility tools</p>
                                            <div className="grid grid-cols-2 gap-2">
                                                {[
                                                    ['Text size', Type, 'bg-primary text-primary-foreground'],
                                                    ['Contrast', Palette, 'border'],
                                                    ['Dark mode', Sparkles, 'border'],
                                                    ['Reading guide', Compass, 'border'],
                                                ].map(([label, Icon, cls]) => (
                                                    <div key={label as string} className={`flex flex-col items-center gap-1 rounded-xl p-2.5 text-[11px] font-semibold ${cls}`}>
                                                        <Icon className="size-4" />
                                                        {label as string}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute right-8 bottom-8 flex size-14 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 via-primary to-sky-500 text-white shadow-xl shadow-primary/40">
                                    <Code2 className="size-6" />
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                <section id="features" className="mx-auto max-w-6xl px-5 py-20">
                    <div className="mx-auto mb-12 max-w-2xl text-center">
                        <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl">Everything a visitor needs</h2>
                        <p className="mt-3 text-muted-foreground">Profiles for different needs, and tools for text, colour, reading and navigation.</p>
                    </div>
                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {FEATURES.map(({ title, text, icon: Icon, tone }) => (
                            <article key={title} className="group rounded-2xl border bg-card p-6 transition hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5">
                                <span className={`mb-4 flex size-12 items-center justify-center rounded-2xl ring-1 ring-inset ring-current/10 ${tone}`}>
                                    <Icon className="size-6" />
                                </span>
                                <h3 className="font-bold">{title}</h3>
                                <p className="mt-1.5 text-sm text-muted-foreground">{text}</p>
                            </article>
                        ))}
                    </div>
                </section>

                <section id="how" className="mx-auto max-w-6xl px-5 py-20">
                    <div className="mx-auto mb-12 max-w-2xl text-center">
                        <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl">Add it to your site in four steps</h2>
                        <p className="mt-3 text-muted-foreground">No coding, no hosting, and nothing for your visitors to install.</p>
                    </div>
                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        {STEPS.map(({ title, text, icon: Icon }, index) => (
                            <div key={title} className="relative rounded-2xl border bg-card p-6">
                                <span className="mb-4 flex size-11 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 via-primary to-sky-500 text-sm font-extrabold text-white shadow-md shadow-primary/25">
                                    {index + 1}
                                </span>
                                <Icon className="mb-3 size-5 text-primary" />
                                <h3 className="font-bold">{title}</h3>
                                <p className="mt-1 text-sm text-muted-foreground">{text}</p>
                            </div>
                        ))}
                    </div>

                    <div className="mx-auto mt-12 max-w-3xl overflow-hidden rounded-2xl border bg-slate-950 shadow-2xl">
                        <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
                            <span className="size-2.5 rounded-full bg-rose-400" />
                            <span className="size-2.5 rounded-full bg-amber-400" />
                            <span className="size-2.5 rounded-full bg-emerald-400" />
                            <span className="ml-3 text-xs text-slate-400">your-site.html</span>
                        </div>
                        <pre className="overflow-x-auto p-5 font-mono text-sm leading-6 text-slate-200">
                            <span className="text-sky-300">{'<script'}</span>
                            <span className="text-slate-400">{' src='}</span>
                            <span className="text-amber-300">{`"${appUrl}/widget/your-key.js"`}</span>
                            <span className="text-sky-300">{' defer></script>'}</span>
                        </pre>
                    </div>
                </section>

                <section className="mx-auto max-w-6xl px-5 pb-20">
                    <div className="grid gap-5 md:grid-cols-[1fr_1.4fr]">
                        <div className="rounded-3xl border bg-card p-8">
                            <span className="flex size-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                                <Globe className="size-6" />
                            </span>
                            <h3 className="mt-5 text-xl font-bold">Works on any website</h3>
                            <p className="mt-2 text-sm text-muted-foreground">
                                If your site can load a script tag, it can use ADA Suite. Nothing to install on the visitor's side.
                            </p>
                        </div>
                        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-600 via-primary to-sky-500 p-8 text-white">
                            <div className="pointer-events-none absolute -top-16 -right-16 size-64 rounded-full bg-white/10" aria-hidden="true" />
                            <h3 className="relative text-2xl font-extrabold">Ready to make your site easier to use?</h3>
                            <p className="relative mt-2 max-w-md text-white/85">Create your first toolbar in about a minute.</p>
                            <div className="relative mt-6 flex flex-wrap gap-3">
                                <Link href={auth.user ? dashboardUrl : login()} className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 font-bold text-violet-700 hover:bg-white/90">
                                    {auth.user ? 'Go to dashboard' : 'Log in'} <ArrowRight className="size-4" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                <footer className="border-t">
                    <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-8 text-sm text-muted-foreground">
                        <span className="flex items-center gap-2 font-semibold text-foreground">
                            <AppLogoIcon className="size-6" /> ADA Suite
                        </span>
                        <span>&copy; {new Date().getFullYear()} ADA Suite. Accessibility toolbar for websites.</span>
                    </div>
                </footer>
            </div>
        </>
    );
}
