import { Head, setLayoutProps } from '@inertiajs/react';
import { PageHeader } from '@/components/page-header';
import { ReferenceCatalogue } from '@/components/reference-catalogue';
import { index as brandsIndex } from '@/routes/admin/brands';
import { destroy, index, store, update } from '@/routes/admin/brands/models';

type ModelRow = { id: number; name: string; carsCount: number };

export default function AdminBrandModels({
    brand,
    models,
}: {
    brand: { id: number; name: string };
    models: ModelRow[];
}) {
    setLayoutProps({
        breadcrumbs: [
            { title: 'Marques', href: brandsIndex() },
            { title: brand.name, href: index(brand.id) },
        ],
    });

    return (
        <>
            <Head title={`Modèles ${brand.name}`} />

            <div className="mx-auto w-full max-w-5xl space-y-6 p-4">
                <PageHeader
                    title={brand.name}
                    description="Les modèles disponibles pour cette marque."
                />

                <ReferenceCatalogue
                    entries={models.map((model) => ({
                        id: model.id,
                        name: model.name,
                        usage: model.carsCount,
                    }))}
                    usageLabel="Véhicules"
                    addLabel="Ajouter un modèle"
                    storeAction={store(brand.id).url}
                    updateAction={(id) =>
                        update({ brand: brand.id, model: id }).url
                    }
                    destroyAction={(id) =>
                        destroy({ brand: brand.id, model: id }).url
                    }
                    deleteDescription={(entry) =>
                        entry.usage > 0
                            ? `${entry.usage} véhicule${entry.usage > 1 ? 's utilisent' : ' utilise'} ce modèle : la suppression sera refusée.`
                            : 'Ce modèle n’est utilisé par aucun véhicule.'
                    }
                />
            </div>
        </>
    );
}
