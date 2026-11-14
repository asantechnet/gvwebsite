<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

return new class extends Migration
{
    public function up(): void
    {
        $disk = Storage::disk('public');
        $now = now();

        foreach ($disk->allFiles('uploads') as $path) {
            $kind = explode('/', $path)[1] ?? null;
            if (! in_array($kind, ['image', 'video', 'audio', 'document'], true)) {
                continue;
            }

            DB::table('media_uploads')->insertOrIgnore([
                'uploaded_by' => null,
                'path' => $path,
                'original_name' => basename($path),
                'kind' => $kind,
                'mime_type' => $disk->mimeType($path) ?: null,
                'size' => $disk->size($path),
                'created_at' => $now,
                'updated_at' => $now,
            ]);
        }
    }

    public function down(): void
    {
        // Backfilled records represent real files and must not be removed on rollback.
    }
};
