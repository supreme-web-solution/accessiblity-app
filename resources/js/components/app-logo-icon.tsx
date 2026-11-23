import type { SVGAttributes } from 'react';

/** The ADA Suite mark: a gradient tile with an accessibility figure. */
export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    const gradientId = 'ada-suite-gradient';

    return (
        <svg {...props} viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
                    <stop offset="0" stopColor="#7c3aed" />
                    <stop offset="0.55" stopColor="#1663d7" />
                    <stop offset="1" stopColor="#0ea5e9" />
                </linearGradient>
            </defs>
            <rect width="64" height="64" rx="18" fill={`url(#${gradientId})`} />
            <circle cx="32" cy="32" r="21" fill="none" stroke="#ffffff" strokeOpacity="0.28" strokeWidth="2.5" />
            <circle cx="32" cy="20.5" r="4.6" fill="#ffffff" />
            <path
                fill="#ffffff"
                d="M17 27.5 L32 31 L47 27.5 L47 30.6 L37.2 32.8 L37.2 40 L40.6 49.5 L37.8 50.5 L32 41.6 L26.2 50.5 L23.4 49.5 L26.8 40 L26.8 32.8 L17 30.6 Z"
            />
        </svg>
    );
}
