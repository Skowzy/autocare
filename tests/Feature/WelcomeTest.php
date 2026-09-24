<?php

use App\Models\Brand;

test('the landing page offers the brand catalogue to guests', function () {
    $brand = Brand::factory()->create(['name' => 'Peugeot']);
    $brand->carModels()->create(['name' => '206']);

    $this->get(route('home'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('welcome')
            ->where('brands.0.name', 'Peugeot')
            ->where('brands.0.models.0.name', '206'));
});
