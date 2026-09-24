import { Form, Head, setLayoutProps } from '@inertiajs/react';
import { Trash2 } from 'lucide-react';
import { ConfirmDeleteDialog } from '@/components/confirm-delete-dialog';
import { LicensePlate } from '@/components/license-plate';
import { MaintenanceFields } from '@/components/maintenance-fields';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { formatDate, formatMileage, formatPrice } from '@/lib/format';
import { destroy, index, show, update } from '@/routes/maintenances';
import { show as vehicleShow } from '@/routes/vehicles';
import type { MaintenanceRow, Option } from '@/types/domain';

export default function MaintenanceShow({
    maintenance,
    maintenanceTypes,
}: {
    maintenance: MaintenanceRow;
    maintenanceTypes: Option[];
}) {
    const vehicle = maintenance.vehicle;
    const vehicleName = `${vehicle.brand} ${vehicle.model}`;

    setLayoutProps({
        breadcrumbs: [
            { title: 'Mes entretiens', href: index() },
            { title: maintenance.type, href: show(maintenance.id) },
        ],
    });

    return (
        <>
            <Head title={`${maintenance.type} · ${vehicleName}`} />

            <div className="mx-auto w-full max-w-5xl space-y-8 p-4">
                <PageHeader
                    title={maintenance.type}
                    description={
                        <>
                            {formatDate(maintenance.performedAt)}
                            {' · '}
                            {formatMileage(maintenance.mileage) ??
                                'kilométrage non renseigné'}
                            {' · '}
                            {formatPrice(maintenance.price) ?? 'prix inconnu'}
                        </>
                    }
                    actions={
                        <ConfirmDeleteDialog
                            action={destroy(maintenance.id).url}
                            title="Supprimer cet entretien ?"
                            description={`${maintenance.type} du ${formatDate(maintenance.performedAt)} sera retiré du carnet de votre ${vehicleName}.`}
                            confirmLabel="Supprimer l’entretien"
                            trigger={
                                <Button variant="outline">
                                    <Trash2 />
                                    Supprimer
                                </Button>
                            }
                        />
                    }
                />

                <a
                    href={vehicleShow(vehicle.id).url}
                    className="border-border bg-card hover:border-primary inline-flex items-center gap-3 rounded-md border p-3 transition-colors"
                >
                    <LicensePlate value={vehicle.licensePlate} />
                    <span className="text-sm">
                        <span className="font-medium">{vehicleName}</span>
                        <span className="text-muted-foreground">
                            {' '}
                            · {vehicle.year}
                        </span>
                    </span>
                </a>

                <section className="space-y-4">
                    <h2 className="text-lg font-semibold">
                        Modifier l’entretien
                    </h2>

                    <Form
                        action={update(maintenance.id).url}
                        method="patch"
                        className="max-w-xl space-y-6"
                    >
                        {({ processing, errors }) => (
                            <>
                                <MaintenanceFields
                                    maintenanceTypes={maintenanceTypes}
                                    errors={errors}
                                    defaults={maintenance}
                                />
                                <Button type="submit" disabled={processing}>
                                    Enregistrer les modifications
                                </Button>
                            </>
                        )}
                    </Form>
                </section>
            </div>
        </>
    );
}
