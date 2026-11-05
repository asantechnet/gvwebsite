<?php

namespace App\Http\Requests\Cms;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class DeleteUploadRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()?->can('manage-media') === true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'path' => ['required', 'string', 'max:500', 'regex:#^uploads/(image|video|audio|document)/[0-9]{4}/[0-9]{2}/[0-9a-f-]+\.[a-z0-9]+$#i'],
        ];
    }
}
