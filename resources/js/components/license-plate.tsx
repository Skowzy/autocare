import { cn } from '@/lib/utils';

const sizes = {
    sm: 'h-6 text-xs',
    md: 'h-8 text-base',
    lg: 'h-11 text-2xl',
} as const;

const bands = {
    sm: 'w-3 text-[6px]',
    md: 'w-4 text-[8px]',
    lg: 'w-6 text-[11px]',
} as const;

type LicensePlateProps = {
    value: string | null;
    size?: keyof typeof sizes;
    className?: string;
};

/**
 * A vehicle's registration plate, the way its owner recognises it. Cars with no
 * plate on file fall back to a dashed blank rather than an empty gap.
 */
export function LicensePlate({
    value,
    size = 'md',
    className,
}: LicensePlateProps) {
    return (
        <span
            className={cn(
                'border-plate-edge bg-plate-surface text-plate-ink inline-flex items-stretch overflow-hidden rounded-[3px] border',
                sizes[size],
                className,
            )}
        >
            <span
                aria-hidden
                className={cn(
                    'bg-plate-band font-condensed flex shrink-0 items-end justify-center pb-0.5 font-semibold text-white',
                    bands[size],
                )}
            >
                F
            </span>
            <span
                className={cn(
                    'font-condensed flex items-center px-2 font-semibold tracking-wide tabular-nums',
                    value === null && 'text-muted-foreground tracking-normal',
                )}
            >
                {value ?? 'Sans plaque'}
            </span>
        </span>
    );
}
