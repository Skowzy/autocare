<?php

use App\Enums\UserRole;
use App\Models\Car;
use App\Models\Maintenance;
use App\Models\User;
use Illuminate\Support\Facades\Gate;

test('registering assigns the client role', function () {
    $this->post(route('register.store'), [
        'name' => 'Marc Trullu',
        'email' => 'marc@autocare.test',
        'password' => 'password-of-marc',
        'password_confirmation' => 'password-of-marc',
    ]);

    expect(User::firstWhere('email', 'marc@autocare.test')->role)->toBe(UserRole::User);
});

test('a role cannot be escalated through mass assignment', function () {
    $user = User::create([
        'name' => 'Marc',
        'email' => 'marc2@autocare.test',
        'password' => 'password',
        'role' => UserRole::Admin,
    ]);

    expect($user->fresh()->role)->toBe(UserRole::User);
});

test('an owner may manage their own car and maintenance', function () {
    $user = User::factory()->create();
    $car = Car::factory()->for($user)->create();
    $maintenance = Maintenance::factory()->for($car)->create();

    expect(Gate::forUser($user)->allows('view', $car))->toBeTrue()
        ->and(Gate::forUser($user)->allows('update', $car))->toBeTrue()
        ->and(Gate::forUser($user)->allows('delete', $car))->toBeTrue()
        ->and(Gate::forUser($user)->allows('view', $maintenance))->toBeTrue()
        ->and(Gate::forUser($user)->allows('delete', $maintenance))->toBeTrue();
});

test('a client may not touch another client resources', function () {
    $intruder = User::factory()->create();
    $car = Car::factory()->create();
    $maintenance = Maintenance::factory()->for($car)->create();

    expect(Gate::forUser($intruder)->allows('view', $car))->toBeFalse()
        ->and(Gate::forUser($intruder)->allows('update', $car))->toBeFalse()
        ->and(Gate::forUser($intruder)->allows('delete', $car))->toBeFalse()
        ->and(Gate::forUser($intruder)->allows('view', $maintenance))->toBeFalse()
        ->and(Gate::forUser($intruder)->allows('update', $maintenance))->toBeFalse();
});

test('an administrator bypasses every policy', function () {
    $admin = User::factory()->admin()->create();
    $car = Car::factory()->create();

    expect(Gate::forUser($admin)->allows('view', $car))->toBeTrue()
        ->and(Gate::forUser($admin)->allows('delete', $car))->toBeTrue()
        ->and(Gate::forUser($admin)->allows('admin'))->toBeTrue();
});

test('a client is denied the admin gate', function () {
    expect(Gate::forUser(User::factory()->create())->allows('admin'))->toBeFalse();
});
