<?php

namespace App\Http\Requests;

use App\Concerns\CarValidationRules;
use Illuminate\Foundation\Http\FormRequest;

class UpdateCarRequest extends FormRequest
{
    use CarValidationRules;

    /**
     * The brand and model identify the car and stay fixed after creation.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return $this->carDetailRules();
    }
}
