<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\BrandRequest;
use App\Models\Brand;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class BrandController extends Controller
{
    public function index(): Response
    {
        $brands = Brand::query()
            ->withCount(['carModels', 'carModels as cars_count' => fn ($query) => $query->has('cars')])
            ->orderBy('name')
            ->get();

        return Inertia::render('admin/brands/index', [
            'brands' => $brands->map(fn (Brand $brand): array => [
                'id' => $brand->id,
                'name' => $brand->name,
                'modelsCount' => $brand->car_models_count,
            ])->all(),
        ]);
    }

    public function store(BrandRequest $request): RedirectResponse
    {
        Brand::create($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Marque ajoutée.']);

        return to_route('admin.brands.index');
    }

    public function update(BrandRequest $request, Brand $brand): RedirectResponse
    {
        $brand->update($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Marque modifiée.']);

        return to_route('admin.brands.index');
    }

    public function destroy(Brand $brand): RedirectResponse
    {
        if ($brand->carModels()->has('cars')->exists()) {
            Inertia::flash('toast', [
                'type' => 'error',
                'message' => 'Cette marque a des modèles utilisés par des véhicules.',
            ]);

            return to_route('admin.brands.index');
        }

        $brand->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Marque supprimée.']);

        return to_route('admin.brands.index');
    }
}
