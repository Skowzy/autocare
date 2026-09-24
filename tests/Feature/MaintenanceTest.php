<?php

use App\Models\Car;
use App\Models\Maintenance;
use App\Models\MaintenanceType;
use App\Models\User;

beforeEach(function () {
    $this->user = User::factory()->create();
    $this->car = Car::factory()->for($this->user)->create();
});

test('a maintenance can be recorded on a car', function () {
    $type = MaintenanceType::factory()->create(['name' => 'Vidange']);

    $this->actingAs($this->user)
        ->post(route('vehicles.maintenances.store', $this->car), [
            'maintenance_type_id' => $type->id,
            'performed_at' => '2024-11-02',
            'mileage' => 182400,
            'price' => '60.00',
            'description' => 'Huile 5W40 et filtre à huile.',
        ])
        ->assertRedirect(route('vehicles.show', $this->car));

    expect(Maintenance::first())
        ->car_id->toBe($this->car->id)
        ->mileage->toBe(182400)
        ->price->toBe('60.00');
});

test('recording a maintenance rejects a future date and an unknown type', function () {
    $this->actingAs($this->user)
        ->from(route('vehicles.maintenances.create', $this->car))
        ->post(route('vehicles.maintenances.store', $this->car), [
            'maintenance_type_id' => 999,
            'performed_at' => now()->addYear()->toDateString(),
            'price' => -5,
        ])
        ->assertSessionHasErrors(['maintenance_type_id', 'performed_at', 'price']);

    expect(Maintenance::count())->toBe(0);
});

test('a maintenance can be edited', function () {
    $maintenance = Maintenance::factory()->for($this->car)->create(['price' => '60.00']);
    $type = MaintenanceType::factory()->create();

    $this->actingAs($this->user)
        ->patch(route('maintenances.update', $maintenance), [
            'maintenance_type_id' => $type->id,
            'performed_at' => '2025-01-17',
            'mileage' => 238500,
            'price' => '50.00',
            'description' => null,
        ])
        ->assertRedirect(route('maintenances.show', $maintenance));

    expect($maintenance->fresh())
        ->maintenance_type_id->toBe($type->id)
        ->price->toBe('50.00')
        ->mileage->toBe(238500);
});

test('a maintenance can be deleted', function () {
    $maintenance = Maintenance::factory()->for($this->car)->create();

    $this->actingAs($this->user)
        ->delete(route('maintenances.destroy', $maintenance))
        ->assertRedirect(route('vehicles.show', $this->car));

    expect(Maintenance::count())->toBe(0);
});

test('the maintenance index spans every car of the owner and no one else', function () {
    $otherCar = Car::factory()->for($this->user)->create();
    Maintenance::factory()->for($this->car)->create();
    Maintenance::factory()->for($otherCar)->create();
    Maintenance::factory()->create();

    $this->actingAs($this->user)
        ->get(route('maintenances.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('maintenances/index')
            ->has('maintenances', 2));
});

test('a client cannot reach another client maintenance', function () {
    $maintenance = Maintenance::factory()->create();
    $intruder = User::factory()->create();

    $this->actingAs($intruder)->get(route('maintenances.show', $maintenance))->assertForbidden();
    $this->actingAs($intruder)->delete(route('maintenances.destroy', $maintenance))->assertForbidden();

    expect(Maintenance::count())->toBe(1);
});

test('a client cannot record a maintenance on another client car', function () {
    $car = Car::factory()->create();

    $this->actingAs($this->user)
        ->get(route('vehicles.maintenances.create', $car))
        ->assertForbidden();

    $this->actingAs($this->user)
        ->post(route('vehicles.maintenances.store', $car), [
            'maintenance_type_id' => MaintenanceType::factory()->create()->id,
            'performed_at' => '2024-11-02',
        ])
        ->assertForbidden();

    expect(Maintenance::count())->toBe(0);
});
