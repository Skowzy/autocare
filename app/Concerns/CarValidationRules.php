<?php

namespace App\Concerns;

use App\Enums\FuelType;
use Illuminate\Validation\Rule;

trait CarValidationRules
{
    /**
     * Attributes an owner may change once the car exists.
     *
     * @return array<string, mixed>
     */
    protected function carDetailRules(): array
    {
        return [
            'year' => ['required', 'integer', 'min:1900', 'max:'.(date('Y') + 1)],
            'mileage' => ['nullable', 'integer', 'min:0', 'max:2000000'],
            'fuel_type' => ['required', Rule::enum(FuelType::class)],
            'license_plate' => ['nullable', 'string', 'max:20'],
            'notes' => ['nullable', 'string', 'max:500'],
        ];
    }
}
