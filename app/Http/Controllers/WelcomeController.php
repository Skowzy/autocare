<?php

namespace App\Http\Controllers;

use App\Models\Brand;
use App\Models\CarModel;
use Inertia\Inertia;
use Inertia\Response;

class WelcomeController extends Controller
{
    /**
     * The public landing page, whose quick-add form mirrors the one the legacy
     * app put on its home page.
     */
    public function __invoke(): Response
    {
        $brands = Brand::query()
            ->with(['carModels' => fn ($query) => $query->orderBy('name')])
            ->orderBy('name')
            ->get();

        return Inertia::render('welcome', [
            'brands' => $brands->map(fn (Brand $brand): array => [
                'id' => $brand->id,
                'name' => $brand->name,
                'models' => $brand->carModels
                    ->map(fn (CarModel $model): array => ['id' => $model->id, 'name' => $model->name])
                    ->all(),
            ])->all(),
        ]);
    }
}
