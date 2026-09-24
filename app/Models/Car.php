<?php

namespace App\Models;

use App\Enums\FuelType;
use Database\Factories\CarFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

/**
 * @property int $id
 * @property int $user_id
 * @property int $car_model_id
 * @property int $year
 * @property int|null $mileage
 * @property FuelType $fuel_type
 * @property string|null $license_plate
 * @property string|null $notes
 * @property-read User $user
 * @property-read CarModel $carModel
 * @property-read Maintenance|null $lastMaintenance
 */
#[Fillable(['user_id', 'car_model_id', 'year', 'mileage', 'fuel_type', 'license_plate', 'notes'])]
class Car extends Model
{
    /** @use HasFactory<CarFactory> */
    use HasFactory;

    /**
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * @return BelongsTo<CarModel, $this>
     */
    public function carModel(): BelongsTo
    {
        return $this->belongsTo(CarModel::class);
    }

    /**
     * @return HasMany<Maintenance, $this>
     */
    public function maintenances(): HasMany
    {
        return $this->hasMany(Maintenance::class);
    }

    /**
     * The most recent maintenance performed on this car.
     *
     * @return HasOne<Maintenance, $this>
     */
    public function lastMaintenance(): HasOne
    {
        return $this->hasOne(Maintenance::class)->latestOfMany('performed_at');
    }

    public function brand(): ?Brand
    {
        return $this->carModel->brand;
    }

    protected function casts(): array
    {
        return [
            'year' => 'integer',
            'mileage' => 'integer',
            'fuel_type' => FuelType::class,
        ];
    }
}
