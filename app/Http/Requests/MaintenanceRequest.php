<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class MaintenanceRequest extends FormRequest
{
    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'maintenance_type_id' => ['required', 'integer', 'exists:maintenance_types,id'],
            'performed_at' => ['required', 'date', 'before_or_equal:today'],
            'mileage' => ['nullable', 'integer', 'min:0', 'max:2000000'],
            'price' => ['nullable', 'numeric', 'min:0', 'max:99999999'],
            'description' => ['nullable', 'string', 'max:500'],
        ];
    }
}
