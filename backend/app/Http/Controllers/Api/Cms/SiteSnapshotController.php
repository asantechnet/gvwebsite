<?php

namespace App\Http\Controllers\Api\Cms;

use App\Http\Controllers\Controller;
use App\Http\Requests\Cms\UpdateSiteSnapshotRequest;
use App\Http\Resources\SiteSnapshotResource;
use App\Models\AuditLog;
use App\Models\SiteSnapshot;
use App\Support\SiteSnapshotSanitizer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SiteSnapshotController extends Controller
{
    public function show(Request $request, string $key): SiteSnapshotResource
    {
        $snapshot = SiteSnapshot::query()->where('key', $key)->firstOrFail();
        $this->authorize('view', $snapshot);

        return new SiteSnapshotResource($snapshot);
    }

    public function update(
        UpdateSiteSnapshotRequest $request,
        string $key,
        SiteSnapshotSanitizer $sanitizer,
    ): SiteSnapshotResource {
        $validated = $request->validated();

        $payload = $sanitizer->sanitize($validated['payload']);

        $snapshot = DB::transaction(function () use ($request, $key, $payload, $validated): SiteSnapshot {
            $snapshot = SiteSnapshot::query()->lockForUpdate()->firstOrNew(['key' => $key]);
            $snapshot->fill([
                'payload' => $payload,
                'version' => $snapshot->exists ? $snapshot->version + 1 : 1,
                'updated_by' => $request->user()->id,
                'published_at' => $validated['published'] ? now() : null,
            ])->save();

            AuditLog::create([
                'actor_id' => $request->user()->id,
                'action' => 'site_snapshot.updated',
                'auditable_type' => $snapshot->getMorphClass(),
                'auditable_id' => $snapshot->id,
                'metadata' => [
                    'key' => $key,
                    'version' => $snapshot->version,
                    'published' => $validated['published'],
                ],
                'ip_address' => $request->ip(),
            ]);

            return $snapshot;
        });

        return new SiteSnapshotResource($snapshot);
    }
}
