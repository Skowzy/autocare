import { Form, Head, setLayoutProps } from '@inertiajs/react';
import { LicensePlate } from '@/components/license-plate';
import { MaintenanceFields } from '@/components/maintenance-fields';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { store } from '@/routes/vehicles/maintenances';
import { index as vehiclesIndex, show as vehicleShow } from '@/routes/vehicles';
import type { Option, VehicleSummary } from '@/types/domain';

export default function MaintenanceCreate({
    vehicle,
    maintenanceTypes,
}: {
    vehicle: VehicleSummary;
    maintenanceTypes: Option[];
}) {
    const title = `${vehicle.brand} ${vehicle.model}`;

    setLayoutProps({
        breadcrumbs: [
            { title: 'Mon garage', href: vehiclesIndex() },
            { title, href: vehicleShow(vehicle.id) },
            { title: 'Enregistrer un entretien', href: store(vehicle.id) },
        ],
    });

    return (
        <>
            <Head title={`Entretien · ${title}`} />

            <div className="mx-auto w-full max-w-5xl space-y-6 p-4">
                <PageHeader
                    title="Enregistrer un entretien"
                    description={`Intervention réalisée sur votre ${title}.`}
                    actions={
                        <LicensePlate value={vehicle.licensePlate} size="lg" />
                    }
                />

                <Form
                    action={store(vehicle.id).url}
                    method="post"
                    className="max-w-xl space-y-6"
                >
                    {({ processing, errors }) => (
                        <>
                            <MaintenanceFields
                                maintenanceTypes={maintenanceTypes}
                                errors={errors}
                            />
                            <Button type="submit" disabled={processing}>
                                Enregistrer l’entretien
                            </Button>
                        </>
                    )}
                </Form>
            </div>
        </>
    );
}
