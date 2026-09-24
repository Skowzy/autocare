<?php

use App\Enums\FuelType;
use App\Models\Brand;
use App\Models\Car;
use App\Models\CarModel;
use App\Models\Maintenance;
use App\Models\User;

beforeEach(function () {
    $this->user = User::factory()->create();
});

test('the garage lists only the signed in user cars', function () {
    $mine = Car::factory()->for($this->user)->create();
    Car::factory()->create();

    $this->actingAs($this->user)
        ->get(route('vehicles.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('vehicles/index')
            ->has('vehicles', 1)
            ->where('vehicles.0.id', $mine->id));
});

test('the garage shows the last maintenance of each car', function () {
    $car = Car::factory()->for($this->user)->create();
    Maintenance::factory()->for($car)->create(['performed_at' => '2023-02-01']);
    Maintenance::factory()->for($car)->create(['performed_at' => '2025-04-09']);

    $this->actingAs($this->user)
        ->get(route('vehicles.index'))
        ->assertInertia(fn ($page) => $page->where('vehicles.0.lastMaintenance.performedAt', '2025-04-09'));
});

test('a car can be added', function () {
    $model = CarModel::factory()->create();

    $this->actingAs($this->user)
        ->post(route('vehicles.store'), [
            'car_model_id' => $model->id,
            'year' => 2004,
            'mileage' => 185000,
            'fuel_type' => FuelType::Diesel->value,
            'license_plate' => 'BL-830-ZV',
        ])
        ->assertRedirect(route('vehicles.show', Car::first()));

    expect(Car::first())
        ->user_id->toBe($this->user->id)
        ->license_plate->toBe('BL-830-ZV')
        ->fuel_type->toBe(FuelType::Diesel);
});

test('adding a car rejects an unknown model and a future year', function () {
    $this->actingAs($this->user)
        ->from(route('vehicles.create'))
        ->post(route('vehicles.store'), [
            'car_model_id' => 999,
            'year' => (int) date('Y') + 5,
            'fuel_type' => 'kerosene',
        ])
        ->assertSessionHasErrors(['car_model_id', 'year', 'fuel_type']);

    expect(Car::count())->toBe(0);
});

test('the car form exposes brands with their models', function () {
    $brand = Brand::factory()->create(['name' => 'Peugeot']);
    $brand->carModels()->create(['name' => '206']);

    $this->actingAs($this->user)
        ->get(route('vehicles.create'))
        ->assertInertia(fn ($page) => $page
            ->component('vehicles/create')
            ->where('brands.0.name', 'Peugeot')
            ->where('brands.0.models.0.name', '206')
            ->has('fuelTypes', 4));
});

test('a car detail page carries its maintenance history newest first', function () {
    $car = Car::factory()->for($this->user)->create();
    Maintenance::factory()->for($car)->create(['performed_at' => '2024-01-03']);
    Maintenance::factory()->for($car)->create(['performed_at' => '2024-11-02']);

    $this->actingAs($this->user)
        ->get(route('vehicles.show', $car))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('vehicles/show')
            ->has('maintenances', 2)
            ->where('maintenances.0.performedAt', '2024-11-02'));
});

test('a car can be updated', function () {
    $car = Car::factory()->for($this->user)->create(['mileage' => 100000]);

    $this->actingAs($this->user)
        ->patch(route('vehicles.update', $car), [
            'year' => $car->year,
            'mileage' => 185000,
            'fuel_type' => FuelType::Essence->value,
            'license_plate' => 'PP-123-QQ',
            'notes' => 'Révision des 200 000 km à prévoir.',
        ])
        ->assertRedirect(route('vehicles.show', $car));

    expect($car->fresh())
        ->mileage->toBe(185000)
        ->notes->toBe('Révision des 200 000 km à prévoir.');
});

test('updating a car cannot change its model', function () {
    $car = Car::factory()->for($this->user)->create();
    $other = CarModel::factory()->create();

    $this->actingAs($this->user)->patch(route('vehicles.update', $car), [
        'car_model_id' => $other->id,
        'year' => $car->year,
        'fuel_type' => $car->fuel_type->value,
    ]);

    expect($car->fresh()->car_model_id)->not->toBe($other->id);
});

test('a car can be deleted with its maintenances', function () {
    $car = Car::factory()->for($this->user)->create();
    Maintenance::factory()->for($car)->create();

    $this->actingAs($this->user)
        ->delete(route('vehicles.destroy', $car))
        ->assertRedirect(route('vehicles.index'));

    expect(Car::count())->toBe(0)
        ->and(Maintenance::count())->toBe(0);
});

test('a client cannot reach another client car', function () {
    $car = Car::factory()->create();

    $this->actingAs($this->user)->get(route('vehicles.show', $car))->assertForbidden();
    $this->actingAs($this->user)->get(route('vehicles.edit', $car))->assertForbidden();
    $this->actingAs($this->user)->patch(route('vehicles.update', $car), [
        'year' => 2010, 'fuel_type' => FuelType::Essence->value,
    ])->assertForbidden();
    $this->actingAs($this->user)->delete(route('vehicles.destroy', $car))->assertForbidden();

    expect(Car::count())->toBe(1);
});

test('guests are redirected to login', function () {
    $this->get(route('vehicles.index'))->assertRedirect(route('login'));
});
