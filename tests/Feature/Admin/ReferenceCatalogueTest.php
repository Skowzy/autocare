<?php

use App\Models\Brand;
use App\Models\Car;
use App\Models\CarModel;
use App\Models\Maintenance;
use App\Models\MaintenanceType;
use App\Models\User;

beforeEach(function () {
    $this->admin = User::factory()->admin()->create();
});

test('an administrator manages brands', function () {
    $this->actingAs($this->admin)
        ->post(route('admin.brands.store'), ['name' => 'Peugeot'])
        ->assertRedirect(route('admin.brands.index'));

    $brand = Brand::firstWhere('name', 'Peugeot');

    $this->actingAs($this->admin)
        ->patch(route('admin.brands.update', $brand), ['name' => 'Peugeot SA']);

    expect($brand->fresh()->name)->toBe('Peugeot SA');

    $this->actingAs($this->admin)->delete(route('admin.brands.destroy', $brand));

    expect(Brand::count())->toBe(0);
});

test('a brand name must be unique', function () {
    Brand::factory()->create(['name' => 'Peugeot']);

    $this->actingAs($this->admin)
        ->from(route('admin.brands.index'))
        ->post(route('admin.brands.store'), ['name' => 'Peugeot'])
        ->assertSessionHasErrors('name');

    expect(Brand::count())->toBe(1);
});

test('an administrator manages the models of a brand', function () {
    $brand = Brand::factory()->create();

    $this->actingAs($this->admin)
        ->post(route('admin.brands.models.store', $brand), ['name' => '206'])
        ->assertRedirect(route('admin.brands.models.index', $brand));

    $model = CarModel::firstWhere('name', '206');

    expect($model->brand_id)->toBe($brand->id);

    $this->actingAs($this->admin)
        ->patch(route('admin.brands.models.update', [$brand, $model]), ['name' => '206 SW']);

    expect($model->fresh()->name)->toBe('206 SW');
});

test('the same model name may exist under two brands', function () {
    $first = Brand::factory()->create();
    $second = Brand::factory()->create();
    $first->carModels()->create(['name' => 'Clio']);

    $this->actingAs($this->admin)
        ->post(route('admin.brands.models.store', $second), ['name' => 'Clio'])
        ->assertSessionHasNoErrors();

    expect(CarModel::where('name', 'Clio')->count())->toBe(2);
});

test('a model used by a vehicle is not deleted', function () {
    $car = Car::factory()->create();
    $model = $car->carModel;

    $this->actingAs($this->admin)
        ->delete(route('admin.brands.models.destroy', [$model->brand_id, $model]));

    expect(CarModel::count())->toBe(1);
});

test('an administrator manages maintenance types', function () {
    $this->actingAs($this->admin)
        ->post(route('admin.maintenance-types.store'), ['name' => 'Vidange'])
        ->assertRedirect(route('admin.maintenance-types.index'));

    $type = MaintenanceType::firstWhere('name', 'Vidange');

    $this->actingAs($this->admin)
        ->patch(route('admin.maintenance-types.update', $type), ['name' => 'Vidange moteur']);

    expect($type->fresh()->name)->toBe('Vidange moteur');

    $this->actingAs($this->admin)->delete(route('admin.maintenance-types.destroy', $type));

    expect(MaintenanceType::count())->toBe(0);
});

test('a maintenance type in use is not deleted', function () {
    $maintenance = Maintenance::factory()->create();

    $this->actingAs($this->admin)
        ->delete(route('admin.maintenance-types.destroy', $maintenance->maintenance_type_id));

    expect(MaintenanceType::count())->toBe(1);
});

test('a client is denied every reference catalogue route', function () {
    $client = User::factory()->create();
    $brand = Brand::factory()->create();
    $model = $brand->carModels()->create(['name' => 'Clio']);
    $type = MaintenanceType::factory()->create();

    $this->actingAs($client)->get(route('admin.brands.index'))->assertForbidden();
    $this->actingAs($client)->post(route('admin.brands.store'), ['name' => 'X'])->assertForbidden();
    $this->actingAs($client)->delete(route('admin.brands.destroy', $brand))->assertForbidden();
    $this->actingAs($client)->get(route('admin.brands.models.index', $brand))->assertForbidden();
    $this->actingAs($client)->delete(route('admin.brands.models.destroy', [$brand, $model]))->assertForbidden();
    $this->actingAs($client)->get(route('admin.maintenance-types.index'))->assertForbidden();
    $this->actingAs($client)->delete(route('admin.maintenance-types.destroy', $type))->assertForbidden();
});
