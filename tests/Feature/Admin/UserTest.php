<?php

use App\Models\Car;
use App\Models\User;

beforeEach(function () {
    $this->admin = User::factory()->admin()->create();
});

test('an administrator lists every account', function () {
    User::factory()->count(2)->create();

    $this->actingAs($this->admin)
        ->get(route('admin.users.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('admin/users/index')
            ->has('users', 3));
});

test('an administrator sees the garage of any client', function () {
    $client = User::factory()->create();
    Car::factory()->for($client)->create();

    $this->actingAs($this->admin)
        ->get(route('admin.users.show', $client))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('admin/users/show')
            ->where('profile.id', $client->id)
            ->has('vehicles', 1));
});

test('an administrator deletes a client with their garage', function () {
    $client = User::factory()->create();
    Car::factory()->for($client)->create();

    $this->actingAs($this->admin)
        ->delete(route('admin.users.destroy', $client))
        ->assertRedirect(route('admin.users.index'));

    expect(User::count())->toBe(1)
        ->and(Car::count())->toBe(0);
});

test('an administrator cannot delete their own account from the back office', function () {
    $this->actingAs($this->admin)->delete(route('admin.users.destroy', $this->admin));

    expect(User::count())->toBe(1);
});

test('a client is denied the user back office', function () {
    $client = User::factory()->create();

    $this->actingAs($client)->get(route('admin.users.index'))->assertForbidden();
    $this->actingAs($client)->get(route('admin.users.show', $this->admin))->assertForbidden();
    $this->actingAs($client)->delete(route('admin.users.destroy', $this->admin))->assertForbidden();

    expect(User::count())->toBe(2);
});
