<?php

namespace App\Models;

use Database\Factories\MaintenanceFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $car_id
 * @property int $maintenance_type_id
 * @property Carbon $performed_at
 * @property int|null $mileage
 * @property string|null $price
 * @property string|null $description
 * @property-read Car $car
 * @property-read MaintenanceType $maintenanceType
 */
#[Fillable(['car_id', 'maintenance_type_id', 'performed_at', 'mileage', 'price', 'description'])]
class Maintenance extends Model
{
    /** @use HasFactory<MaintenanceFactory> */
    use HasFactory;

    /**
     * @return BelongsTo<Car, $this>
     */
    public function car(): BelongsTo
    {
        return $this->belongsTo(Car::class);
    }

    /**
     * @return BelongsTo<MaintenanceType, $this>
     */
    public function maintenanceType(): BelongsTo
    {
        return $this->belongsTo(MaintenanceType::class);
    }

    protected function casts(): array
    {
        return [
            'performed_at' => 'date',
            'mileage' => 'integer',
            'price' => 'decimal:2',
        ];
    }
}
