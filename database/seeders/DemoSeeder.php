<?php

namespace Database\Seeders;

use App\Enums\FuelType;
use App\Models\Brand;
use App\Models\Car;
use App\Models\MaintenanceType;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

/**
 * Comptes et données de démonstration, repris des véhicules du dump GarageApp.
 */
class DemoSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        User::factory()->admin()->create([
            'name' => 'Sébastien Trullu',
            'email' => 'admin@autocare.test',
        ]);

        $client = User::factory()->create([
            'name' => 'Marc Trullu',
            'email' => 'client@autocare.test',
        ]);

        $peugeot = $this->car($client, 'Peugeot', '206', [
            'year' => 2004,
            'mileage' => 185_000,
            'fuel_type' => FuelType::Diesel,
            'license_plate' => 'BL-830-ZV',
        ]);

        $this->maintenance($peugeot, 'Vidange', '2024-11-02', 182_400, '60.00', 'Huile 5W40 et filtre à huile.');
        $this->maintenance($peugeot, 'Remplacement des pneus', '2024-05-14', 175_000, '420.00', null);
        $this->maintenance($peugeot, 'Contrôle des plaquettes de frein', '2024-01-03', 168_200, '0.00', 'Usure mesurée à 40 %.');

        $golf = $this->car($client, 'Volkswagen', 'Golf', [
            'year' => 2010,
            'mileage' => 240_000,
            'fuel_type' => FuelType::Essence,
            'license_plate' => 'PP-123-QQ',
        ]);

        $this->maintenance($golf, 'Vidange', '2025-01-17', 238_500, '50.00', null);
    }

    /**
     * @param  array<string, mixed>  $attributes
     */
    private function car(User $user, string $brand, string $model, array $attributes): Car
    {
        $carModel = Brand::query()
            ->where('name', $brand)
            ->firstOrFail()
            ->carModels()
            ->firstOrCreate(['name' => $model]);

        return $user->cars()->create([
            ...$attributes,
            'car_model_id' => $carModel->id,
        ]);
    }

    private function maintenance(Car $car, string $type, string $date, int $mileage, string $price, ?string $description): void
    {
        $car->maintenances()->create([
            'maintenance_type_id' => MaintenanceType::query()->where('name', $type)->firstOrFail()->id,
            'performed_at' => $date,
            'mileage' => $mileage,
            'price' => $price,
            'description' => $description,
        ]);
    }
}
