<?php

namespace App\Enums;

enum FuelType: string
{
    case Essence = 'essence';
    case Diesel = 'diesel';
    case Electrique = 'electrique';
    case Hybride = 'hybride';

    public function label(): string
    {
        return match ($this) {
            self::Essence => 'Essence',
            self::Diesel => 'Diesel',
            self::Electrique => 'Électrique',
            self::Hybride => 'Hybride',
        };
    }

    /**
     * @return list<array{value: string, label: string}>
     */
    public static function options(): array
    {
        return array_map(
            fn (self $case): array => ['value' => $case->value, 'label' => $case->label()],
            self::cases(),
        );
    }
}
