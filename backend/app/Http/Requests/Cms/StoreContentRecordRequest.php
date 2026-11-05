<?php

namespace App\Http\Requests\Cms;

use App\Models\ContentRecord;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreContentRecordRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()?->can('create', ContentRecord::class) === true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'slug' => [
                'required', 'string', 'max:180', 'regex:/^[a-z0-9]+(?:-[a-z0-9]+)*$/',
                Rule::unique('content_records')->where('collection', (string) $this->route('collection')),
            ],
            'type' => ['nullable', 'string', 'max:60'],
            'category' => ['nullable', 'string', 'max:120'],
            'status' => ['required', Rule::in(['draft', 'published'])],
            'featured' => ['required', 'boolean'],
            'image' => ['nullable', 'string', 'max:2048'],
            'href' => ['nullable', 'string', 'max:2048'],
            'translations' => ['required', 'array:prs,ps,en'],
            'translations.prs' => ['required', 'array'],
            'translations.ps' => ['required', 'array'],
            'translations.en' => ['required', 'array'],
            'translations.*.title' => ['required', 'string', 'max:180'],
            'translations.*.excerpt' => ['nullable', 'string', 'max:1000'],
            'translations.*.content' => ['nullable', 'string', 'max:100000'],
            'translations.*.tags' => ['present', 'array', 'max:30'],
            'translations.*.tags.*' => ['string', 'max:80'],
            'translations.*.seoTitle' => ['nullable', 'string', 'max:180'],
            'translations.*.metaDescription' => ['nullable', 'string', 'max:500'],
            'translations.*.imageAlt' => ['nullable', 'string', 'max:300'],
            'metadata' => ['nullable', 'array'],
        ];
    }
}
