import { Link } from '@inertiajs/react';
import { formatDate, formatMileage, formatPrice } from '@/lib/format';
import { show } from '@/routes/maintenances';
import type { MaintenanceEntry } from '@/types/domain';

/**
 * A service book is a run of dated stamps, so the history reads as a timeline
 * rather than a grid of cards.
 */
export function MaintenanceTimeline({
    maintenances,
}: {
    maintenances: MaintenanceEntry[];
}) {
    return (
        <ol className="relative">
            {maintenances.map((maintenance, index) => (
                <li key={maintenance.id} className="relative flex gap-4 pb-6">
                    {index < maintenances.length - 1 && (
                        <span
                            aria-hidden
                            className="bg-border absolute top-6 bottom-0 left-[3.5px] w-px sm:left-[7.25rem]"
                        />
                    )}

                    <time
                        dateTime={maintenance.performedAt}
                        className="text-muted-foreground font-condensed hidden w-28 shrink-0 pt-px text-right text-sm sm:block"
                    >
                        {formatDate(maintenance.performedAt)}
                    </time>

                    <span
                        aria-hidden
                        className="bg-primary mt-1.5 size-2 shrink-0 rounded-full"
                    />

                    <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                            <Link
                                href={show(maintenance.id)}
                                className="hover:text-primary font-medium underline-offset-4 hover:underline"
                            >
                                {maintenance.type}
                            </Link>
                            <span className="font-condensed text-sm tabular-nums">
                                {formatMileage(maintenance.mileage) ?? '—'}
                                <span className="text-muted-foreground px-2">
                                    ·
                                </span>
                                {formatPrice(maintenance.price) ?? '—'}
                            </span>
                        </div>

                        <time
                            dateTime={maintenance.performedAt}
                            className="text-muted-foreground font-condensed text-sm sm:hidden"
                        >
                            {formatDate(maintenance.performedAt)}
                        </time>

                        {maintenance.description && (
                            <p className="text-muted-foreground mt-1 max-w-prose text-sm">
                                {maintenance.description}
                            </p>
                        )}
                    </div>
                </li>
            ))}
        </ol>
    );
}
