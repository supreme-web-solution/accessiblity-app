import AppLogoIcon from '@/components/app-logo-icon';

/** Sidebar brand: the mark plus the product name and a short tagline. */
export default function AppLogo() {
    return (
        <>
            <AppLogoIcon className="size-8 shrink-0 drop-shadow-sm" />
            <div className="ml-1 grid min-w-0 flex-1 text-left leading-tight">
                <span className="truncate text-sm font-bold tracking-tight">ADA Suite</span>
                <span className="truncate text-[11px] font-medium text-muted-foreground">Accessibility toolbar</span>
            </div>
        </>
    );
}
