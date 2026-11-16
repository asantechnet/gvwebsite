<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['uploaded_by', 'path', 'original_name', 'kind', 'mime_type', 'size'])]
class MediaUpload extends Model
{
    protected function casts(): array
    {
        return ['size' => 'integer'];
    }
}
