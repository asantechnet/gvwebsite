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
        $largestLimitKilobytes = (int) ceil(max(config('globalvision.upload_limits')) / 1024);

        return [
            'kind' => ['nullable', 'string', 'in:image,video,audio,document'],
            'file' => [
                'required',
                File::types([
                    'jpg', 'jpeg', 'png', 'webp', 'gif',
                    'mp4', 'webm', 'ogv', 'mov',
                    'mp3', 'wav', 'ogg', 'm4a', 'flac',
                    'pdf',
                ])->max($largestLimitKilobytes),
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

            $limits = config('globalvision.upload_limits');

            if ($actualKind && $file->getSize() > $limits[$actualKind]) {
                $validator->errors()->add('file', 'The file exceeds the maximum size for its media type.');
            }
        }];
    }
}
