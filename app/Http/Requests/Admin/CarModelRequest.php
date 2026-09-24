<?php

namespace App\Http\Requests\Admin;

use App\Models\Brand;
use App\Models\CarModel;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CarModelRequest extends FormRequest
{
    /**
     * A model name only has to be unique within its own brand.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        $brand = $this->route('brand');

        return [
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique(CarModel::class, 'name')
                    ->where('brand_id', $brand instanceof Brand ? $brand->id : null)
                    ->ignore($this->route('model')),
            ],
        ];
    }
}
