import InputError from '@/components/input-error';
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
import type { MaintenanceEntry, Option } from '@/types/domain';

type MaintenanceFieldsProps = {
    maintenanceTypes: Option[];
    errors: Partial<Record<string, string>>;
    defaults?: MaintenanceEntry & { typeId: number };
};

export function MaintenanceFields({
    maintenanceTypes,
    errors,
    defaults,
}: MaintenanceFieldsProps) {
    return (
        <>
            <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                    <Label htmlFor="maintenance_type_id">Type</Label>
                    <Select
                        name="maintenance_type_id"
                        defaultValue={
                            defaults ? String(defaults.typeId) : undefined
                        }
                    >
                        <SelectTrigger
                            id="maintenance_type_id"
                            className="w-full"
                        >
                            <SelectValue placeholder="Choisir un type" />
                        </SelectTrigger>
                        <SelectContent>
                            {maintenanceTypes.map((type) => (
                                <SelectItem
                                    key={type.id}
                                    value={String(type.id)}
                                >
                                    {type.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <InputError message={errors.maintenance_type_id} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="performed_at">Date</Label>
                    <Input
                        id="performed_at"
                        name="performed_at"
                        type="date"
                        defaultValue={defaults?.performedAt}
                        required
                    />
                    <InputError message={errors.performed_at} />
                </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                    <Label htmlFor="mileage">Kilométrage</Label>
                    <Input
                        id="mileage"
                        name="mileage"
                        type="number"
                        inputMode="numeric"
                        defaultValue={defaults?.mileage ?? ''}
                        placeholder="182400"
                    />
                    <InputError message={errors.mileage} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="price">Prix payé</Label>
                    <Input
                        id="price"
                        name="price"
                        type="number"
                        step="0.01"
                        min="0"
                        inputMode="decimal"
                        defaultValue={defaults?.price ?? ''}
                        placeholder="60.00"
                    />
                    <InputError message={errors.price} />
                </div>
            </div>

            <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                    id="description"
                    name="description"
                    rows={3}
                    maxLength={500}
                    defaultValue={defaults?.description ?? ''}
                    placeholder="Huile 5W40 et filtre à huile."
                />
                <InputError message={errors.description} />
            </div>
        </>
    );
}
