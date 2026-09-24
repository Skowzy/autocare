import { Form, Head, Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { LicensePlate } from '@/components/license-plate';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { login, register } from '@/routes';
import { index as vehiclesIndex, store } from '@/routes/vehicles';
import type { BrandOption } from '@/types/domain';

export default function Welcome({ brands }: { brands: BrandOption[] }) {
    const { auth } = usePage().props;
    const [brandId, setBrandId] = useState('');
    const [carModelId, setCarModelId] = useState('');

    const models = brands.find((b) => String(b.id) === brandId)?.models ?? [];

    return (
        <>
            <Head title="Le carnet d’entretien de vos véhicules" />

            <div className="min-h-svh">
                <header className="border-border border-b">
                    <nav className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4">
                        <span className="font-condensed text-lg font-bold tracking-tight">
                            AutoCare
                        </span>
                        {auth.user ? (
                            <Button asChild size="sm">
                                <Link href={vehiclesIndex()}>Mon garage</Link>
                            </Button>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Button asChild variant="ghost" size="sm">
                                    <Link href={login()}>Connexion</Link>
                                </Button>
                                <Button asChild size="sm">
                                    <Link href={register()}>
                                        Créer un compte
                                    </Link>
                                </Button>
                            </div>
                        )}
                    </nav>
                </header>

                <main className="mx-auto max-w-5xl px-4 py-16">
                    <section className="max-w-2xl">
                        <LicensePlate value="AU-T0-CARE" size="lg" />

                        <h1 className="mt-8 text-4xl font-semibold tracking-tight sm:text-5xl">
                            Le carnet d’entretien de vos véhicules, tenu à jour.
                        </h1>
                        <p className="text-muted-foreground mt-4 max-w-prose text-lg">
                            Vidange, plaquettes, pneus : notez chaque
                            intervention avec sa date, son kilométrage et son
                            prix. Vous retrouvez l’historique complet quand vous
                            revendez, ou quand le garage vous demande quand
                            c’était la dernière fois.
                        </p>
                    </section>

                    <section className="border-border bg-card mt-16 rounded-md border p-6">
                        <h2 className="font-semibold">
                            Commencez par un véhicule
                        </h2>
                        <p className="text-muted-foreground mt-1 text-sm">
                            {auth.user
                                ? 'Ajoutez-le à votre garage.'
                                : 'Créez votre compte pour enregistrer votre premier véhicule.'}
                        </p>

                        <Form
                            action={store().url}
                            method="post"
                            className="mt-6 grid gap-4 sm:grid-cols-4"
                        >
                            {({ processing }) => (
                                <>
                                    <div className="grid gap-2">
                                        <Label htmlFor="welcome-brand">
                                            Marque
                                        </Label>
                                        <Select
                                            value={brandId}
                                            onValueChange={(value) => {
                                                setBrandId(value);
                                                setCarModelId('');
                                            }}
                                        >
                                            <SelectTrigger
                                                id="welcome-brand"
                                                className="w-full"
                                            >
                                                <SelectValue placeholder="Marque" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {brands.map((brand) => (
                                                    <SelectItem
                                                        key={brand.id}
                                                        value={String(brand.id)}
                                                    >
                                                        {brand.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="welcome-model">
                                            Modèle
                                        </Label>
                                        <Select
                                            value={carModelId}
                                            onValueChange={setCarModelId}
                                            disabled={brandId === ''}
                                        >
                                            <SelectTrigger
                                                id="welcome-model"
                                                className="w-full"
                                            >
                                                <SelectValue placeholder="Modèle" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {models.map((model) => (
                                                    <SelectItem
                                                        key={model.id}
                                                        value={String(model.id)}
                                                    >
                                                        {model.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <input
                                            type="hidden"
                                            name="car_model_id"
                                            value={carModelId}
                                        />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="welcome-year">
                                            Année
                                        </Label>
                                        <Input
                                            id="welcome-year"
                                            name="year"
                                            type="number"
                                            placeholder="2004"
                                        />
                                    </div>

                                    <div className="flex items-end">
                                        {auth.user ? (
                                            <Button
                                                type="submit"
                                                className="w-full"
                                                disabled={processing}
                                            >
                                                Ajouter au garage
                                            </Button>
                                        ) : (
                                            <Button
                                                asChild
                                                className="w-full"
                                                type="button"
                                            >
                                                <Link href={register()}>
                                                    Créer un compte
                                                </Link>
                                            </Button>
                                        )}
                                    </div>
                                </>
                            )}
                        </Form>
                    </section>
                </main>
            </div>
        </>
    );
}
