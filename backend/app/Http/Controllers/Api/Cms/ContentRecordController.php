<?php

namespace App\Http\Controllers\Api\Cms;

use App\Http\Controllers\Controller;
use App\Http\Requests\Cms\StoreContentRecordRequest;
use App\Http\Requests\Cms\UpdateContentRecordRequest;
use App\Http\Resources\ContentRecordResource;
use App\Models\ContentRecord;
use App\Support\RichTextSanitizer;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ContentRecordController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(string $collection): AnonymousResourceCollection
    {
        $this->authorize('viewAny', ContentRecord::class);
        $this->ensureValidCollection($collection);

        return ContentRecordResource::collection(
            ContentRecord::query()
                ->where('collection', $collection)
                ->latest()
                ->latest('id')
                ->paginate(50),
        );
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(
        StoreContentRecordRequest $request,
        string $collection,
        RichTextSanitizer $sanitizer,
    ): JsonResponse {
        $this->ensureValidCollection($collection);
        $attributes = $request->validated();
        $attributes['collection'] = $collection;
        $attributes['translations'] = $sanitizer->sanitizeTranslations($attributes['translations']);
        $record = ContentRecord::create($attributes);

        return (new ContentRecordResource($record))->response()->setStatusCode(201);
    }

    public function show(string $collection, ContentRecord $contentRecord): ContentRecordResource
    {
        $this->ensureRecordCollection($contentRecord, $collection);
        $this->authorize('view', $contentRecord);

        return new ContentRecordResource($contentRecord);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(
        UpdateContentRecordRequest $request,
        string $collection,
        ContentRecord $contentRecord,
        RichTextSanitizer $sanitizer,
    ): ContentRecordResource {
        $this->ensureRecordCollection($contentRecord, $collection);
        $attributes = $request->validated();
        $attributes['translations'] = $sanitizer->sanitizeTranslations($attributes['translations']);
        $contentRecord->update($attributes);

        return new ContentRecordResource($contentRecord);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $collection, ContentRecord $contentRecord): JsonResponse
    {
        $this->ensureRecordCollection($contentRecord, $collection);
        $this->authorize('delete', $contentRecord);
        $contentRecord->delete();

        return response()->json(null, 204);
    }

    private function ensureValidCollection(string $collection): void
    {
        abort_unless(in_array($collection, config('globalvision.content_collections'), true), 404);
    }

    private function ensureRecordCollection(ContentRecord $record, string $collection): void
    {
        $this->ensureValidCollection($collection);
        abort_unless($record->collection === $collection, 404);
    }
}
