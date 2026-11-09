<?php

namespace App\Http\Requests\Cms;

use Illuminate\Foundation\Http\FormRequest;

class ReplyToMessageRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('update', $this->route('message')) === true;
    }

    public function rules(): array
    {
        return ['subject' => ['required', 'string', 'max:255'], 'message' => ['required', 'string', 'max:10000']];
    }
}
