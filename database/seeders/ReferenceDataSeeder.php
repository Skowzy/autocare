<?php

namespace Database\Seeders;

use App\Models\Brand;
use App\Models\MaintenanceType;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

/**
 * Référentiel repris de GarageApp : marques, modèles et types d'entretien.
 */
class ReferenceDataSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * @var array<string, list<string>>
     */
    private const BRANDS = [
        'Renault' => ['Arkana', 'Captur', 'Clio', 'Espace', 'Kadjar', 'Kangoo', 'Master', 'Mégane', 'Trafic', 'Twingo', 'Zoé'],
        'Peugeot' => ['108', '2008', '206', '208', '3008', '308', '5008', '508', 'Expert', 'Partner', 'Rifter', 'Traveller'],
        'Citroën' => ['Ami', 'Berlingo', 'C1', 'C3', 'C3 Aircross', 'C4', 'C5 Aircross', 'C5 X', 'Jumpy', 'SpaceTourer', 'ë-C4'],
        'Volkswagen' => ['Arteon', 'Caddy', 'Golf', 'ID.3', 'Passat', 'Polo', 'T-Cross', 'T-Roc', 'Tiguan', 'Touareg', 'Touran'],
        'BMW' => ['M3', 'M5', 'Série 1', 'Série 3', 'Série 4', 'Série 5', 'X1', 'X3', 'X5', 'Z4', 'i3'],
        'Mercedes-Benz' => ['CLA', 'CLS', 'Classe A', 'Classe C', 'Classe E', 'Classe S', 'EQC', 'GLA', 'GLC', 'GLE', 'GLS'],
        'Audi' => ['A1', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'Q2', 'Q3', 'Q5', 'Q7'],
        'Ford' => ['Ecosport', 'Fiesta', 'Focus', 'Galaxy', 'Kuga', 'Mondeo', 'Mustang', 'Puma', 'Ranger', 'S-MAX', 'Transit'],
        'Toyota' => ['Auris', 'Aygo', 'C-HR', 'Camry', 'Corolla', 'Hilux', 'Land Cruiser', 'Prius', 'Proace', 'RAV4', 'Yaris'],
        'Nissan' => ['370Z', 'GT-R', 'Juke', 'Leaf', 'Micra', 'Murano', 'NV200', 'Navara', 'Pathfinder', 'Qashqai', 'X-Trail'],
        'Hyundai' => ['Bayon', 'Ioniq', 'Kona', 'Nexo', 'Santa Fe', 'Staria', 'Tucson', 'i10', 'i20', 'i30', 'i40'],
        'Kia' => ['Carnival', 'Ceed', 'EV6', 'Niro', 'Optima', 'Picanto', 'Rio', 'Sorento', 'Soul', 'Sportage', 'Stonic'],
    ];

    /**
     * @var list<string>
     */
    private const MAINTENANCE_TYPES = [
        'Vidange',
        'Remplacement filtre à huile',
        'Remplacement filtre à air',
        'Remplacement filtre d\'habitacle',
        'Remplacement bougies d\'allumage',
        'Remplacement liquide de frein',
        'Remplacement liquide de refroidissement',
        'Contrôle des plaquettes de frein',
        'Remplacement des plaquettes de frein',
        'Contrôle des disques de frein',
        'Remplacement des disques de frein',
        'Remplacement des pneus',
        'Remplacement de la batterie',
        'Contrôle de l\'éclairage',
        'Remplacement des ampoules',
        'Contrôle des amortisseurs',
        'Remplacement des amortisseurs',
        'Contrôle de la courroie de distribution',
        'Remplacement de la courroie de distribution',
        'Recharge de la climatisation',
        'Contrôle du système d\'échappement',
        'Contrôle de la direction',
    ];

    public function run(): void
    {
        foreach (self::BRANDS as $name => $models) {
            $brand = Brand::query()->firstOrCreate(['name' => $name]);

            foreach ($models as $model) {
                $brand->carModels()->firstOrCreate(['name' => $model]);
            }
        }

        foreach (self::MAINTENANCE_TYPES as $name) {
            MaintenanceType::query()->firstOrCreate(['name' => $name]);
        }
    }
}
