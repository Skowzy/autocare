<?php

use App\Enums\FuelType;
use App\Models\Brand;
use App\Models\Car;
use App\Models\Maintenance;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

uses(TestCase::class, RefreshDatabase::class);

test('last maintenance returns the most recently performed one', function () {
    $car = Car::factory()->create();

    Maintenance::factory()->for($car)->create(['performed_at' => '2024-01-10']);
    $latest = Maintenance::factory()->for($car)->create(['performed_at' => '2025-03-02']);
    Maintenance::factory()->for($car)->create(['performed_at' => '2024-08-21']);

    expect($car->lastMaintenance->id)->toBe($latest->id);
});

test('last maintenance is null when the car has no maintenance', function () {
    expect(Car::factory()->create()->lastMaintenance)->toBeNull();
});

test('brand is derived through the car model', function () {
    $brand = Brand::factory()->create(['name' => 'Peugeot']);
    $car = Car::factory()->for($brand->carModels()->create(['name' => '206']))->create();

    expect($car->brand()->name)->toBe('Peugeot');
});

test('fuel type is cast to an enum', function () {
    $car = Car::factory()->create(['fuel_type' => FuelType::Diesel]);

    expect($car->fresh()->fuel_type)->toBe(FuelType::Diesel);
});

test('deleting a car cascades to its maintenances', function () {
    $car = Car::factory()->create();
    Maintenance::factory()->for($car)->create();

    $car->delete();

    expect(Maintenance::count())->toBe(0);
});

test('deleting a user cascades to their cars', function () {
    $user = User::factory()->create();
    Car::factory()->for($user)->create();

    $user->delete();

    expect(Car::count())->toBe(0);
});
