export type Vehicle = {
    id: number;
    brand: string;
    model: string;
    year: number;
    mileage: number | null;
    fuelType: string;
    fuelTypeLabel: string;
    licensePlate: string | null;
    notes: string | null;
};

export type VehicleSummary = {
    id: number;
    brand: string;
    model: string;
    year: number;
    mileage: number | null;
    licensePlate: string | null;
};

export type VehicleCardData = Vehicle & {
    lastMaintenance: { type: string; performedAt: string } | null;
};

export type MaintenanceEntry = {
    id: number;
    type: string;
    performedAt: string;
    mileage: number | null;
    price: string | null;
    description: string | null;
};

export type MaintenanceRow = MaintenanceEntry & {
    typeId: number;
    vehicle: VehicleSummary;
};

export type Option = { id: number; name: string };

export type BrandOption = Option & { models: Option[] };

export type FuelTypeOption = { value: string; label: string };
