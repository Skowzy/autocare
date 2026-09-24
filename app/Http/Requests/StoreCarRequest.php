<?php

namespace App\Http\Requests;

use App\Concerns\CarValidationRules;
use Illuminate\Foundation\Http\FormRequest;

class StoreCarRequest extends FormRequest
{
    use CarValidationRules;

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'car_model_id' => ['required', 'integer', 'exists:car_models,id'],
            ...$this->carDetailRules(),
        ];
    }
}
