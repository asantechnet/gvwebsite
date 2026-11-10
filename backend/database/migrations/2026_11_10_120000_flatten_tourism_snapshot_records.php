<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $snapshot = DB::table('site_snapshots')->where('key', 'collection:tourism')->first();

        if (! $snapshot) {
            return;
        }

        $payload = json_decode($snapshot->payload, true);
        if (! is_array($payload)) {
            return;
        }

        // Flatten the known accidental one-record wrappers without altering
        // any arrays nested inside a record.
        $flattened = collect($payload)
            ->flatten(1)
            ->filter(fn (mixed $record): bool => is_array($record) && isset($record['translations']))
            ->values()
            ->all();

        if ($flattened === [] && $payload !== []) {
            return;
        }

        DB::table('site_snapshots')->where('id', $snapshot->id)->update([
            'payload' => json_encode($flattened, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
            'version' => $snapshot->version + 1,
            'updated_at' => now(),
        ]);
    }

    public function down(): void
    {
        // The previous nesting was invalid and is intentionally not restored.
    }
};
