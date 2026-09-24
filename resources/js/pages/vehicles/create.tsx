import { Form, Head } from '@inertiajs/react';
import { useState } from 'react';
import InputError from '@/components/input-error';
import { PageHeader } from '@/components/page-header';
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
import { create, index, store } from '@/routes/vehicles';
import type { BrandOption, FuelTypeOption } from '@/types/domain';

export default function VehicleCreate({
    brands,
    fuelTypes,
}: {
    brands: BrandOption[];
    fuelTypes: FuelTypeOption[];
}) {
    const [brandId, setBrandId] = useState<string>('');
    const [carModelId, setCarModelId] = useState<string>('');

    const models = brands.find((b) => String(b.id) === brandId)?.models ?? [];

    return (
        <>
            <Head title="Ajouter un véhicule" />

            <div className="mx-auto w-full max-w-5xl space-y-6 p-4">
                <PageHeader
                    title="Ajouter un véhicule"
                    description="La marque et le modèle identifient le véhicule et ne pourront plus être changés ensuite."
                />

                <Form
                    action={store().url}
                    method="post"
                    className="max-w-xl space-y-6"
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="brand">Marque</Label>
                                <Select
                                    value={brandId}
                                    onValueChange={(value) => {
                                        setBrandId(value);
                                        setCarModelId('');
                                    }}
                                >
                                    <SelectTrigger
                                        id="brand"
                                        className="w-full"
                                    >
                                        <SelectValue placeholder="Choisir une marque" />
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
                                <Label htmlFor="car_model_id">Modèle</Label>
                                <Select
                                    value={carModelId}
                                    onValueChange={setCarModelId}
                                    disabled={brandId === ''}
                                >
                                    <SelectTrigger
                                        id="car_model_id"
                                        className="w-full"
                                    >
                                        <SelectValue
                                            placeholder={
                                                brandId === ''
                                                    ? 'Choisissez d’abord une marque'
                                                    : 'Choisir un modèle'
                                            }
                                        />
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
                                <InputError message={errors.car_model_id} />
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="grid gap-2">
                                    <Label htmlFor="year">Année</Label>
                                    <Input
                                        id="year"
                                        name="year"
                                        type="number"
                                        inputMode="numeric"
                                        placeholder="2004"
                                        required
                                    />
                                    <InputError message={errors.year} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="mileage">Kilométrage</Label>
                                    <Input
                                        id="mileage"
                                        name="mileage"
                                        type="number"
                                        inputMode="numeric"
                                        placeholder="185000"
                                    />
                                    <InputError message={errors.mileage} />
                                </div>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="grid gap-2">
                                    <Label htmlFor="fuel_type">Carburant</Label>
                                    <Select name="fuel_type" defaultValue="">
                                        <SelectTrigger
                                            id="fuel_type"
                                            className="w-full"
                                        >
                                            <SelectValue placeholder="Choisir" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {fuelTypes.map((fuel) => (
                                                <SelectItem
                                                    key={fuel.value}
                                                    value={fuel.value}
                                                >
                                                    {fuel.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.fuel_type} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="license_plate">
                                        Immatriculation
                                    </Label>
                                    <Input
                                        id="license_plate"
                                        name="license_plate"
                                        placeholder="BL-830-ZV"
                                        autoCapitalize="characters"
                                    />
                                    <InputError
                                        message={errors.license_plate}
                                    />
                                </div>
                            </div>

                            <Button type="submit" disabled={processing}>
                                Ajouter le véhicule
                            </Button>
                        </>
                    )}
                </Form>
            </div>
        </>
    );
}

VehicleCreate.layout = {
    breadcrumbs: [
        { title: 'Mon garage', href: index() },
        { title: 'Ajouter un véhicule', href: create() },
    ],
};
