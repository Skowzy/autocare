import { Form, Head, setLayoutProps } from '@inertiajs/react';
import InputError from '@/components/input-error';
import { LicensePlate } from '@/components/license-plate';
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
import { Textarea } from '@/components/ui/textarea';
import { edit, index, show, update } from '@/routes/vehicles';
import type { FuelTypeOption, Vehicle } from '@/types/domain';

export default function VehicleEdit({
    vehicle,
    fuelTypes,
}: {
    vehicle: Vehicle;
    fuelTypes: FuelTypeOption[];
}) {
    const title = `${vehicle.brand} ${vehicle.model}`;

    setLayoutProps({
        breadcrumbs: [
            { title: 'Mon garage', href: index() },
            { title, href: show(vehicle.id) },
            { title: 'Modifier', href: edit(vehicle.id) },
        ],
    });

    return (
        <>
            <Head title={`Modifier ${title}`} />

            <div className="mx-auto w-full max-w-5xl space-y-6 p-4">
                <PageHeader
                    title={title}
                    description="La marque et le modèle identifient le véhicule et ne sont pas modifiables."
                    actions={
                        <LicensePlate value={vehicle.licensePlate} size="lg" />
                    }
                />

                <Form
                    action={update(vehicle.id).url}
                    method="patch"
                    className="max-w-xl space-y-6"
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="grid gap-2">
                                    <Label htmlFor="year">Année</Label>
                                    <Input
                                        id="year"
                                        name="year"
                                        type="number"
                                        defaultValue={vehicle.year}
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
                                        defaultValue={vehicle.mileage ?? ''}
                                    />
                                    <InputError message={errors.mileage} />
                                </div>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="grid gap-2">
                                    <Label htmlFor="fuel_type">Carburant</Label>
                                    <Select
                                        name="fuel_type"
                                        defaultValue={vehicle.fuelType}
                                    >
                                        <SelectTrigger
                                            id="fuel_type"
                                            className="w-full"
                                        >
                                            <SelectValue />
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
                                        defaultValue={
                                            vehicle.licensePlate ?? ''
                                        }
                                        autoCapitalize="characters"
                                    />
                                    <InputError
                                        message={errors.license_plate}
                                    />
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="notes">Notes</Label>
                                <Textarea
                                    id="notes"
                                    name="notes"
                                    rows={4}
                                    maxLength={500}
                                    defaultValue={vehicle.notes ?? ''}
                                    placeholder="Révision des 200 000 km à prévoir."
                                />
                                <InputError message={errors.notes} />
                            </div>

                            <Button type="submit" disabled={processing}>
                                Enregistrer les modifications
                            </Button>
                        </>
                    )}
                </Form>
            </div>
        </>
    );
}
