<?php

namespace App\Models;

use Database\Factories\ContentRecordFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['collection', 'slug', 'type', 'category', 'status', 'featured', 'image', 'href', 'translations', 'metadata'])]
class ContentRecord extends Model
{
    /** @use HasFactory<ContentRecordFactory> */
    use HasFactory;

    protected function casts(): array
    {
        return [
            'featured' => 'boolean',
            'translations' => 'array',
            'metadata' => 'array',
        ];
    }
}
