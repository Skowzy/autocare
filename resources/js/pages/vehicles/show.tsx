import { Head, Link, setLayoutProps } from '@inertiajs/react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { ConfirmDeleteDialog } from '@/components/confirm-delete-dialog';
import { EmptyState } from '@/components/empty-state';
import { LicensePlate } from '@/components/license-plate';
import { MaintenanceTimeline } from '@/components/maintenance-timeline';
import { Button } from '@/components/ui/button';
import { formatMileage } from '@/lib/format';
import { create } from '@/routes/vehicles/maintenances';
import { destroy, edit, index, show } from '@/routes/vehicles';
import type { MaintenanceEntry, Vehicle } from '@/types/domain';

export default function VehicleShow({
    vehicle,
    maintenances,
}: {
    vehicle: Vehicle;
    maintenances: MaintenanceEntry[];
}) {
    const title = `${vehicle.brand} ${vehicle.model}`;
    const mileage = formatMileage(vehicle.mileage);

    setLayoutProps({
        breadcrumbs: [
            { title: 'Mon garage', href: index() },
            { title, href: show(vehicle.id) },
        ],
    });

    return (
        <>
            <Head title={title} />

            <div className="mx-auto w-full max-w-5xl space-y-8 p-4">
                <div className="border-border flex flex-wrap items-start justify-between gap-4 border-b pb-4">
                    <div className="flex flex-wrap items-center gap-4">
                        <LicensePlate value={vehicle.licensePlate} size="lg" />
                        <div>
                            <h1 className="text-2xl font-semibold tracking-tight">
                                {title}
                            </h1>
                            <p className="text-muted-foreground font-condensed text-sm">
                                {vehicle.year} · {vehicle.fuelTypeLabel}
                                {mileage && ` · ${mileage}`}
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <Button variant="outline" asChild>
                            <Link href={edit(vehicle.id)}>
                                <Pencil />
                                Modifier
                            </Link>
                        </Button>
                        <ConfirmDeleteDialog
                            action={destroy(vehicle.id).url}
                            title="Supprimer ce véhicule ?"
                            description={`${title} et ses ${maintenances.length} entretien${maintenances.length > 1 ? 's' : ''} seront définitivement supprimés.`}
                            confirmLabel="Supprimer le véhicule"
                            trigger={
                                <Button variant="outline">
                                    <Trash2 />
                                    Supprimer
                                </Button>
                            }
                        />
                    </div>
                </div>

                {vehicle.notes && (
                    <p className="text-muted-foreground max-w-prose text-sm">
                        {vehicle.notes}
                    </p>
                )}

                <section className="space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <h2 className="text-lg font-semibold">Entretiens</h2>
                        <Button asChild>
                            <Link href={create(vehicle.id)}>
                                <Plus />
                                Enregistrer un entretien
                            </Link>
                        </Button>
                    </div>

                    {maintenances.length === 0 ? (
                        <EmptyState
                            title="Carnet vierge"
                            description="Enregistrez la première intervention réalisée sur ce véhicule : vidange, pneus, plaquettes…"
                            action={
                                <Button asChild>
                                    <Link href={create(vehicle.id)}>
                                        Enregistrer un entretien
                                    </Link>
                                </Button>
                            }
                        />
                    ) : (
                        <MaintenanceTimeline maintenances={maintenances} />
                    )}
                </section>
            </div>
        </>
    );
}
