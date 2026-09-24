<?php

namespace Database\Factories;

use App\Models\Car;
use App\Models\Maintenance;
use App\Models\MaintenanceType;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Maintenance>
 */
class MaintenanceFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'car_id' => Car::factory(),
            'maintenance_type_id' => MaintenanceType::factory(),
            'performed_at' => fake()->dateTimeBetween('-3 years'),
            'mileage' => fake()->numberBetween(1_000, 300_000),
            'price' => fake()->randomFloat(2, 0, 900),
            'description' => fake()->optional()->sentence(),
        ];
    }
}
