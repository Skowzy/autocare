import { Head } from '@inertiajs/react';
import { PageHeader } from '@/components/page-header';
import { ReferenceCatalogue } from '@/components/reference-catalogue';
import { destroy, index, store, update } from '@/routes/admin/brands';
import { index as modelsIndex } from '@/routes/admin/brands/models';

type BrandRow = { id: number; name: string; modelsCount: number };

export default function AdminBrands({ brands }: { brands: BrandRow[] }) {
    return (
        <>
            <Head title="Marques" />

            <div className="mx-auto w-full max-w-5xl space-y-6 p-4">
                <PageHeader
                    title="Marques"
                    description="Le catalogue proposé aux clients quand ils ajoutent un véhicule."
                />

                <ReferenceCatalogue
                    entries={brands.map((brand) => ({
                        id: brand.id,
                        name: brand.name,
                        usage: brand.modelsCount,
                        href: modelsIndex(brand.id).url,
                    }))}
                    usageLabel="Modèles"
                    addLabel="Ajouter une marque"
                    storeAction={store().url}
                    updateAction={(id) => update(id).url}
                    destroyAction={(id) => destroy(id).url}
                    deleteDescription={(entry) =>
                        `Ses ${entry.usage} modèle${entry.usage > 1 ? 's' : ''} seront supprimés avec elle.`
                    }
                />
            </div>
        </>
    );
}

AdminBrands.layout = {
    breadcrumbs: [{ title: 'Marques', href: index() }],
};
