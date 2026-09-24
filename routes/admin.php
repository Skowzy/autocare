<?php

use App\Http\Controllers\Admin\BrandController;
use App\Http\Controllers\Admin\CarModelController;
use App\Http\Controllers\Admin\MaintenanceTypeController;
use App\Http\Controllers\Admin\UserController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified', 'can:admin'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {
        Route::resource('users', UserController::class)
            ->only(['index', 'show', 'destroy']);

        Route::resource('brands', BrandController::class)
            ->only(['index', 'store', 'update', 'destroy']);

        Route::resource('brands.models', CarModelController::class)
            ->only(['index', 'store', 'update', 'destroy'])
            ->parameters(['models' => 'model']);

        Route::resource('maintenance-types', MaintenanceTypeController::class)
            ->only(['index', 'store', 'update', 'destroy']);
    });
