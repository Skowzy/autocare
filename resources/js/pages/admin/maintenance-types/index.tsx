import { Head } from '@inertiajs/react';
import { PageHeader } from '@/components/page-header';
import { ReferenceCatalogue } from '@/components/reference-catalogue';
import {
    destroy,
    index,
    store,
    update,
} from '@/routes/admin/maintenance-types';

type TypeRow = { id: number; name: string; maintenancesCount: number };

export default function AdminMaintenanceTypes({
    maintenanceTypes,
}: {
    maintenanceTypes: TypeRow[];
}) {
    return (
        <>
            <Head title="Types d’entretien" />

            <div className="mx-auto w-full max-w-5xl space-y-6 p-4">
                <PageHeader
                    title="Types d’entretien"
                    description="La liste proposée aux clients quand ils enregistrent une intervention."
                />

                <ReferenceCatalogue
                    entries={maintenanceTypes.map((type) => ({
                        id: type.id,
                        name: type.name,
                        usage: type.maintenancesCount,
                    }))}
                    usageLabel="Entretiens"
                    addLabel="Ajouter un type"
                    storeAction={store().url}
                    updateAction={(id) => update(id).url}
                    destroyAction={(id) => destroy(id).url}
                    deleteDescription={(entry) =>
                        entry.usage > 0
                            ? `${entry.usage} entretien${entry.usage > 1 ? 's utilisent' : ' utilise'} ce type : la suppression sera refusée.`
                            : 'Ce type n’est utilisé par aucun entretien.'
                    }
                />
            </div>
        </>
    );
}

AdminMaintenanceTypes.layout = {
    breadcrumbs: [{ title: 'Types d’entretien', href: index() }],
};
