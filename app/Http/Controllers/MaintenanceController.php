<?php

namespace App\Http\Controllers;

use App\Http\Requests\MaintenanceRequest;
use App\Models\Car;
use App\Models\Maintenance;
use App\Models\MaintenanceType;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MaintenanceController extends Controller
{
    /**
     * Every maintenance recorded by the owner, across all of their cars.
     */
    public function index(Request $request): Response
    {
        $maintenances = Maintenance::query()
            ->with(['maintenanceType', 'car.carModel.brand'])
            ->whereHas('car', fn ($query) => $query->where('user_id', $request->user()->id))
            ->orderByDesc('performed_at')
            ->orderByDesc('id')
            ->get();

        return Inertia::render('maintenances/index', [
            'maintenances' => $maintenances->map($this->toRow(...))->all(),
        ]);
    }

    public function create(Car $vehicle): Response
    {
        $this->authorize('update', $vehicle);

        $vehicle->load('carModel.brand');

        return Inertia::render('maintenances/create', [
            'vehicle' => $this->vehicle($vehicle),
            'maintenanceTypes' => $this->types(),
        ]);
    }

    public function store(MaintenanceRequest $request, Car $vehicle): RedirectResponse
    {
        $this->authorize('update', $vehicle);

        $vehicle->maintenances()->create($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Entretien enregistré.']);

        return to_route('vehicles.show', $vehicle);
    }

    public function show(Maintenance $maintenance): Response
    {
        $this->authorize('view', $maintenance);

        $maintenance->load(['maintenanceType', 'car.carModel.brand']);

        return Inertia::render('maintenances/show', [
            'maintenance' => $this->toRow($maintenance),
            'maintenanceTypes' => $this->types(),
        ]);
    }

    public function update(MaintenanceRequest $request, Maintenance $maintenance): RedirectResponse
    {
        $this->authorize('update', $maintenance);

        $maintenance->update($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Entretien modifié.']);

        return to_route('maintenances.show', $maintenance);
    }

    public function destroy(Maintenance $maintenance): RedirectResponse
    {
        $this->authorize('delete', $maintenance);

        $vehicle = $maintenance->car;

        $maintenance->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Entretien supprimé.']);

        return to_route('vehicles.show', $vehicle);
    }

    /**
     * @return list<array{id: int, name: string}>
     */
    private function types(): array
    {
        return array_values(MaintenanceType::query()
            ->orderBy('name')
            ->get()
            ->map(fn (MaintenanceType $type): array => ['id' => $type->id, 'name' => $type->name])
            ->all());
    }

    /**
     * @return array<string, mixed>
     */
    private function vehicle(Car $car): array
    {
        return [
            'id' => $car->id,
            'brand' => $car->carModel->brand->name,
            'model' => $car->carModel->name,
            'year' => $car->year,
            'mileage' => $car->mileage,
            'licensePlate' => $car->license_plate,
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function toRow(Maintenance $maintenance): array
    {
        return [
            'id' => $maintenance->id,
            'typeId' => $maintenance->maintenance_type_id,
            'type' => $maintenance->maintenanceType->name,
            'performedAt' => $maintenance->performed_at->toDateString(),
            'mileage' => $maintenance->mileage,
            'price' => $maintenance->price,
            'description' => $maintenance->description,
            'vehicle' => $this->vehicle($maintenance->car),
        ];
    }
}
