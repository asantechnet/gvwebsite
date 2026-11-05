<?php

namespace App\Http\Requests\Cms;

use Illuminate\Validation\Rule;

class UpdateContentRecordRequest extends StoreContentRecordRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $contentRecord = $this->route('contentRecord');

        return $contentRecord && $this->user()?->can('update', $contentRecord) === true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $rules = parent::rules();
        $rules['slug'] = [
            'required', 'string', 'max:180', 'regex:/^[a-z0-9]+(?:-[a-z0-9]+)*$/',
            Rule::unique('content_records')->where('collection', (string) $this->route('collection'))
                ->ignore($this->route('contentRecord')),
        ];

        return $rules;
    }
}
