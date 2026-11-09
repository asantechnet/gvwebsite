<?php

namespace App\Http\Requests\Cms;

use Illuminate\Foundation\Http\FormRequest;

class ResolveMapLinkRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->hasPermission('content.manage') === true;
    }

    public function rules(): array
    {
        return ['url' => ['required', 'url:https', 'max:2048']];
    }
}
