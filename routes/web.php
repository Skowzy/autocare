<?php

use App\Http\Controllers\CarController;
use App\Http\Controllers\MaintenanceController;
use App\Http\Controllers\WelcomeController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/', WelcomeController::class)->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    // Administrators land on the back office, clients on their garage.
    Route::get('dashboard', fn (Request $request) => $request->user()->isAdmin()
        ? to_route('admin.users.index')
        : to_route('vehicles.index'))->name('dashboard');

    Route::resource('vehicles', CarController::class);

    Route::resource('vehicles.maintenances', MaintenanceController::class)
        ->only(['create', 'store'])
        ->shallow();

    Route::resource('maintenances', MaintenanceController::class)
        ->only(['index', 'show', 'update', 'destroy']);
});

require __DIR__.'/admin.php';
require __DIR__.'/settings.php';
