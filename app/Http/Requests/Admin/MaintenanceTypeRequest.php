<?php

namespace App\Http\Requests\Admin;

use App\Models\MaintenanceType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class MaintenanceTypeRequest extends FormRequest
{
    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique(MaintenanceType::class, 'name')
                    ->ignore($this->route('maintenance_type')),
            ],
        ];
    }
}
