<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Car;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    public function index(): Response
    {
        $users = User::query()
            ->withCount('cars')
            ->orderBy('name')
            ->get();

        return Inertia::render('admin/users/index', [
            'users' => $users->map(fn (User $user): array => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role->value,
                'roleLabel' => $user->role->label(),
                'carsCount' => $user->cars_count,
            ])->all(),
        ]);
    }

    public function show(User $user): Response
    {
        $cars = $user->cars()
            ->with(['carModel.brand', 'lastMaintenance.maintenanceType'])
            ->orderBy('id')
            ->get();

        return Inertia::render('admin/users/show', [
            'profile' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'roleLabel' => $user->role->label(),
            ],
            'vehicles' => $cars->map(fn (Car $car): array => [
                'id' => $car->id,
                'brand' => $car->carModel->brand->name,
                'model' => $car->carModel->name,
                'year' => $car->year,
                'mileage' => $car->mileage,
                'fuelType' => $car->fuel_type->value,
                'fuelTypeLabel' => $car->fuel_type->label(),
                'licensePlate' => $car->license_plate,
                'notes' => $car->notes,
                'lastMaintenance' => $car->lastMaintenance === null ? null : [
                    'type' => $car->lastMaintenance->maintenanceType->name,
                    'performedAt' => $car->lastMaintenance->performed_at->toDateString(),
                ],
            ])->all(),
        ]);
    }

    public function destroy(Request $request, User $user): RedirectResponse
    {
        if ($user->is($request->user())) {
            Inertia::flash('toast', [
                'type' => 'error',
                'message' => 'Supprimez votre propre compte depuis vos paramètres.',
            ]);

            return to_route('admin.users.index');
        }

        $user->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Utilisateur supprimé.']);

        return to_route('admin.users.index');
    }
}
