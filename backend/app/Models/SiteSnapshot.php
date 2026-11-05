<?php

namespace App\Models;

use Database\Factories\SiteSnapshotFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['key', 'payload', 'version', 'updated_by', 'published_at'])]
class SiteSnapshot extends Model
{
    /** @use HasFactory<SiteSnapshotFactory> */
    use HasFactory;

    public function editor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    public function getRouteKeyName(): string
    {
        return 'key';
    }

    protected function casts(): array
    {
        return [
            'payload' => 'array',
            'published_at' => 'datetime',
        ];
    }
}
