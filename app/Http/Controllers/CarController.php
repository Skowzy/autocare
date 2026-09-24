<?php

namespace App\Http\Controllers;

use App\Enums\FuelType;
use App\Http\Requests\StoreCarRequest;
use App\Http\Requests\UpdateCarRequest;
use App\Models\Brand;
use App\Models\Car;
use App\Models\CarModel;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CarController extends Controller
{
    public function index(Request $request): Response
    {
        $cars = $request->user()
            ->cars()
            ->with(['carModel.brand', 'lastMaintenance.maintenanceType'])
            ->orderBy('id')
            ->get();

        return Inertia::render('vehicles/index', [
            'vehicles' => $cars->map($this->toCard(...))->all(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('vehicles/create', [
            'brands' => $this->brands(),
            'fuelTypes' => FuelType::options(),
        ]);
    }

    public function store(StoreCarRequest $request): RedirectResponse
    {
        $car = $request->user()->cars()->create($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Véhicule ajouté.']);

        return to_route('vehicles.show', $car);
    }

    public function show(Car $vehicle): Response
    {
        $this->authorize('view', $vehicle);

        $vehicle->load('carModel.brand');

        $maintenances = $vehicle->maintenances()
            ->with('maintenanceType')
            ->orderByDesc('performed_at')
            ->orderByDesc('id')
            ->get();

        return Inertia::render('vehicles/show', [
            'vehicle' => $this->toDetail($vehicle),
            'maintenances' => $maintenances->map(fn ($maintenance): array => [
                'id' => $maintenance->id,
                'type' => $maintenance->maintenanceType->name,
                'performedAt' => $maintenance->performed_at->toDateString(),
                'mileage' => $maintenance->mileage,
                'price' => $maintenance->price,
                'description' => $maintenance->description,
            ])->all(),
        ]);
    }

    public function edit(Car $vehicle): Response
    {
        $this->authorize('update', $vehicle);

        $vehicle->load('carModel.brand');

        return Inertia::render('vehicles/edit', [
            'vehicle' => $this->toDetail($vehicle),
            'fuelTypes' => FuelType::options(),
        ]);
    }

    public function update(UpdateCarRequest $request, Car $vehicle): RedirectResponse
    {
        $this->authorize('update', $vehicle);

        $vehicle->update($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Véhicule modifié.']);

        return to_route('vehicles.show', $vehicle);
    }

    public function destroy(Car $vehicle): RedirectResponse
    {
        $this->authorize('delete', $vehicle);

        $vehicle->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Véhicule supprimé.']);

        return to_route('vehicles.index');
    }

    /**
     * Brands with their models, for the dependent selects on the car form.
     *
     * @return list<array{id: int, name: string, models: list<array{id: int, name: string}>}>
     */
    private function brands(): array
    {
        $brands = Brand::query()
            ->with(['carModels' => fn ($query) => $query->orderBy('name')])
            ->orderBy('name')
            ->get();

        return array_values($brands->map(fn (Brand $brand): array => [
            'id' => $brand->id,
            'name' => $brand->name,
            'models' => array_values($brand->carModels->map(
                fn (CarModel $model): array => ['id' => $model->id, 'name' => $model->name],
            )->all()),
        ])->all());
    }

    /**
     * @return array<string, mixed>
     */
    private function toCard(Car $car): array
    {
        $last = $car->lastMaintenance;

        return [
            ...$this->toDetail($car),
            'lastMaintenance' => $last === null ? null : [
                'type' => $last->maintenanceType->name,
                'performedAt' => $last->performed_at->toDateString(),
            ],
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function toDetail(Car $car): array
    {
        return [
            'id' => $car->id,
            'brand' => $car->carModel->brand->name,
            'model' => $car->carModel->name,
            'year' => $car->year,
            'mileage' => $car->mileage,
            'fuelType' => $car->fuel_type->value,
            'fuelTypeLabel' => $car->fuel_type->label(),
            'licensePlate' => $car->license_plate,
            'notes' => $car->notes,
        ];
    }
}
