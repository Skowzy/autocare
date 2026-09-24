import { Head, Link } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { EmptyState } from '@/components/empty-state';
import { PageHeader } from '@/components/page-header';
import { VehicleCard } from '@/components/vehicle-card';
import { Button } from '@/components/ui/button';
import { create, index } from '@/routes/vehicles';
import type { VehicleCardData } from '@/types/domain';

export default function VehiclesIndex({
    vehicles,
}: {
    vehicles: VehicleCardData[];
}) {
    return (
        <>
            <Head title="Mon garage" />

            <div className="mx-auto w-full max-w-5xl space-y-6 p-4">
                <PageHeader
                    title="Mon garage"
                    description={
                        vehicles.length === 0
                            ? 'Aucun véhicule pour le moment.'
                            : `${vehicles.length} véhicule${vehicles.length > 1 ? 's' : ''}`
                    }
                    actions={
                        <Button asChild>
                            <Link href={create()}>
                                <Plus />
                                Ajouter un véhicule
                            </Link>
                        </Button>
                    }
                />

                {vehicles.length === 0 ? (
                    <EmptyState
                        title="Votre garage est vide"
                        description="Ajoutez un véhicule pour commencer à tenir son carnet d'entretien."
                        action={
                            <Button asChild>
                                <Link href={create()}>Ajouter un véhicule</Link>
                            </Button>
                        }
                    />
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                        {vehicles.map((vehicle) => (
                            <VehicleCard key={vehicle.id} vehicle={vehicle} />
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}

VehiclesIndex.layout = {
    breadcrumbs: [{ title: 'Mon garage', href: index() }],
};
