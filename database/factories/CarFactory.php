<?php

namespace Database\Factories;

use App\Enums\FuelType;
use App\Models\Car;
use App\Models\CarModel;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Arr;

/**
 * @extends Factory<Car>
 */
class CarFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'car_model_id' => CarModel::factory(),
            'year' => fake()->numberBetween(1995, (int) date('Y')),
            'mileage' => fake()->numberBetween(1_000, 300_000),
            'fuel_type' => Arr::random(FuelType::cases()),
            'license_plate' => strtoupper(fake()->bothify('??-###-??')),
            'notes' => null,
        ];
    }
}
