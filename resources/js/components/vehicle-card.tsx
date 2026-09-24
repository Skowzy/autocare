import { Link } from '@inertiajs/react';
import { LicensePlate } from '@/components/license-plate';
import { formatDate, formatMileage } from '@/lib/format';
import { show } from '@/routes/vehicles';
import type { VehicleCardData } from '@/types/domain';

export function VehicleCard({ vehicle }: { vehicle: VehicleCardData }) {
    const mileage = formatMileage(vehicle.mileage);

    return (
        <Link
            href={show(vehicle.id)}
            prefetch
            className="border-border bg-card hover:border-primary focus-visible:ring-ring flex flex-col gap-4 rounded-md border p-4 transition-colors focus-visible:ring-2 focus-visible:outline-none"
        >
            <LicensePlate value={vehicle.licensePlate} className="self-start" />

            <div>
                <p className="font-semibold">
                    {vehicle.brand} {vehicle.model}
                </p>
                <p className="text-muted-foreground font-condensed text-sm">
                    {vehicle.year} · {vehicle.fuelTypeLabel}
                    {mileage && ` · ${mileage}`}
                </p>
            </div>

            <div className="border-border mt-auto border-t pt-3 text-sm">
                {vehicle.lastMaintenance ? (
                    <>
                        <p className="font-medium">
                            {vehicle.lastMaintenance.type}
                        </p>
                        <time
                            dateTime={vehicle.lastMaintenance.performedAt}
                            className="text-muted-foreground"
                        >
                            {formatDate(vehicle.lastMaintenance.performedAt)}
                        </time>
                    </>
                ) : (
                    <p className="text-muted-foreground">
                        Aucun entretien enregistré
                    </p>
                )}
            </div>
        </Link>
    );
}
