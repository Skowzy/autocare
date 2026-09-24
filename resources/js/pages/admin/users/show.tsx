import { Head, setLayoutProps } from '@inertiajs/react';
import { EmptyState } from '@/components/empty-state';
import { PageHeader } from '@/components/page-header';
import { VehicleCard } from '@/components/vehicle-card';
import { Badge } from '@/components/ui/badge';
import { index, show } from '@/routes/admin/users';
import type { VehicleCardData } from '@/types/domain';

type Profile = {
    id: number;
    name: string;
    email: string;
    roleLabel: string;
};

export default function AdminUserShow({
    profile,
    vehicles,
}: {
    profile: Profile;
    vehicles: VehicleCardData[];
}) {
    setLayoutProps({
        breadcrumbs: [
            { title: 'Utilisateurs', href: index() },
            { title: profile.name, href: show(profile.id) },
        ],
    });

    return (
        <>
            <Head title={profile.name} />

            <div className="mx-auto w-full max-w-5xl space-y-6 p-4">
                <PageHeader
                    title={profile.name}
                    description={profile.email}
                    actions={
                        <Badge variant="secondary">{profile.roleLabel}</Badge>
                    }
                />

                <section className="space-y-4">
                    <h2 className="text-lg font-semibold">
                        Garage ({vehicles.length})
                    </h2>

                    {vehicles.length === 0 ? (
                        <EmptyState
                            title="Aucun véhicule"
                            description="Ce compte n’a encore enregistré aucun véhicule."
                        />
                    ) : (
                        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                            {vehicles.map((vehicle) => (
                                <VehicleCard
                                    key={vehicle.id}
                                    vehicle={vehicle}
                                />
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </>
    );
}
