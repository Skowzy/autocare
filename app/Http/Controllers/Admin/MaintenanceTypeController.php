<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\MaintenanceTypeRequest;
use App\Models\MaintenanceType;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class MaintenanceTypeController extends Controller
{
    public function index(): Response
    {
        $types = MaintenanceType::query()
            ->withCount('maintenances')
            ->orderBy('name')
            ->get();

        return Inertia::render('admin/maintenance-types/index', [
            'maintenanceTypes' => $types->map(fn (MaintenanceType $type): array => [
                'id' => $type->id,
                'name' => $type->name,
                'maintenancesCount' => $type->maintenances_count,
            ])->all(),
        ]);
    }

    public function store(MaintenanceTypeRequest $request): RedirectResponse
    {
        MaintenanceType::create($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Type ajouté.']);

        return to_route('admin.maintenance-types.index');
    }

    public function update(MaintenanceTypeRequest $request, MaintenanceType $maintenanceType): RedirectResponse
    {
        $maintenanceType->update($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Type modifié.']);

        return to_route('admin.maintenance-types.index');
    }

    public function destroy(MaintenanceType $maintenanceType): RedirectResponse
    {
        if ($maintenanceType->maintenances()->exists()) {
            Inertia::flash('toast', [
                'type' => 'error',
                'message' => 'Ce type est utilisé par des entretiens enregistrés.',
            ]);

            return to_route('admin.maintenance-types.index');
        }

        $maintenanceType->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Type supprimé.']);

        return to_route('admin.maintenance-types.index');
    }
}
