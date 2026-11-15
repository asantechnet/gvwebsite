<?php

namespace App\Http\Requests\Cms;

use App\Models\SiteSnapshot;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class UpdateSiteSnapshotRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $snapshot = SiteSnapshot::query()->where('key', $this->route('key'))->first();

        return $this->user()?->can($snapshot ? 'update' : 'create', $snapshot ?? SiteSnapshot::class) === true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'payload' => ['required', 'array'],
            'published' => ['required', 'boolean'],
        ];
    }

    public function after(): array
    {
        return [function (Validator $validator): void {
            if (! in_array($this->route('key'), config('globalvision.snapshot_keys'), true)) {
                $validator->errors()->add('key', 'The selected site snapshot is invalid.');
            }

            $encoded = json_encode($this->input('payload'));
            if ($encoded === false || mb_strlen($encoded, '8bit') > 2 * 1024 * 1024) {
                $validator->errors()->add('payload', 'The site snapshot may not exceed 2 MB.');
            }

            $validateColors = function (mixed $value, string $path = 'payload') use (&$validateColors, $validator): void {
                if (! is_array($value)) {
                    return;
                }

                foreach ($value as $key => $item) {
                    $itemPath = $path.'.'.$key;
                    if (in_array(mb_strtolower((string) $key), ['primary', 'secondary'], true) && (! is_string($item) || ! preg_match('/^#[0-9a-f]{6}$/i', $item))) {
                        $validator->errors()->add($itemPath, 'Brand colors must use a six-digit hexadecimal value.');
                    } elseif (is_array($item)) {
                        $validateColors($item, $itemPath);
                    }
                }
            };
            $validateColors($this->input('payload'));
        }];
    }
}
