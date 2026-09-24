<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\CarModelRequest;
use App\Models\Brand;
use App\Models\CarModel;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class CarModelController extends Controller
{
    public function index(Brand $brand): Response
    {
        $models = $brand->carModels()
            ->withCount('cars')
            ->orderBy('name')
            ->get();

        return Inertia::render('admin/brands/models', [
            'brand' => ['id' => $brand->id, 'name' => $brand->name],
            'models' => $models->map(fn (CarModel $model): array => [
                'id' => $model->id,
                'name' => $model->name,
                'carsCount' => $model->cars_count,
            ])->all(),
        ]);
    }

    public function store(CarModelRequest $request, Brand $brand): RedirectResponse
    {
        $brand->carModels()->create($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Modèle ajouté.']);

        return to_route('admin.brands.models.index', $brand);
    }

    public function update(CarModelRequest $request, Brand $brand, CarModel $model): RedirectResponse
    {
        $model->update($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Modèle modifié.']);

        return to_route('admin.brands.models.index', $brand);
    }

    public function destroy(Brand $brand, CarModel $model): RedirectResponse
    {
        if ($model->cars()->exists()) {
            Inertia::flash('toast', [
                'type' => 'error',
                'message' => 'Ce modèle est utilisé par des véhicules.',
            ]);

            return to_route('admin.brands.models.index', $brand);
        }

        $model->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Modèle supprimé.']);

        return to_route('admin.brands.models.index', $brand);
    }
}
