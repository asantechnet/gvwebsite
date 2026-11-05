<?php

namespace App\Http\Requests\Cms;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\File;
use Illuminate\Validation\Validator;

class StoreUploadRequest extends FormRequest
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
            'kind' => ['nullable', 'string', 'in:image,video,audio,document'],
            'file' => [
                'required',
                File::types([
                    'jpg', 'jpeg', 'png', 'webp', 'gif',
                    'mp4', 'webm', 'mov',
                    'mp3', 'wav', 'ogg', 'm4a',
                    'pdf',
                ])->max(50 * 1024),
            ],
        ];
    }

    public function after(): array
    {
        return [function (Validator $validator): void {
            $file = $this->file('file');
            if (! $file || ! $file->isValid()) {
                return;
            }

            $mime = (string) $file->getMimeType();
            $actualKind = match (true) {
                str_starts_with($mime, 'image/') => 'image',
                str_starts_with($mime, 'video/') => 'video',
                str_starts_with($mime, 'audio/') => 'audio',
                $mime === 'application/pdf' => 'document',
                default => null,
            };
            $requestedKind = $this->input('kind');

            if ($requestedKind && $actualKind && $requestedKind !== $actualKind) {
                $validator->errors()->add('kind', 'The selected upload kind does not match the file.');
            }

            $limits = [
                'image' => 5 * 1024 * 1024,
                'video' => 50 * 1024 * 1024,
                'audio' => 20 * 1024 * 1024,
                'document' => 10 * 1024 * 1024,
            ];

            if ($actualKind && $file->getSize() > $limits[$actualKind]) {
                $validator->errors()->add('file', 'The file exceeds the maximum size for its media type.');
            }
        }];
    }
}
