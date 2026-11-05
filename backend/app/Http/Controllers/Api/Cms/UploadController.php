<?php

namespace App\Http\Controllers\Api\Cms;

use App\Http\Controllers\Controller;
use App\Http\Requests\Cms\DeleteUploadRequest;
use App\Http\Requests\Cms\StoreUploadRequest;
use App\Models\AuditLog;
use App\Support\UploadScanner;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use RuntimeException;

class UploadController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(StoreUploadRequest $request, UploadScanner $scanner): JsonResponse
    {
        $file = $request->file('file');
        try {
            $scanner->scan($file->getRealPath());
        } catch (RuntimeException $exception) {
            throw ValidationException::withMessages(['file' => [$exception->getMessage()]]);
        }

        $kind = $request->validated('kind') ?? $this->kindForMime($file->getMimeType());
        $path = $file->storeAs(
            'uploads/'.$kind.'/'.now()->format('Y/m'),
            Str::uuid().'.'.$file->extension(),
            'public',
        );

        AuditLog::create([
            'actor_id' => $request->user()->id,
            'action' => 'media.uploaded',
            'metadata' => ['path' => $path, 'kind' => $kind, 'size' => $file->getSize()],
            'ip_address' => $request->ip(),
        ]);

        return response()->json(['data' => [
            'path' => $path,
            'url' => Storage::disk('public')->url($path),
            'kind' => $kind,
            'name' => $file->getClientOriginalName(),
            'size' => $file->getSize(),
            'mimeType' => $file->getMimeType(),
        ]], 201);
    }

    private function kindForMime(?string $mime): string
    {
        return match (true) {
            str_starts_with((string) $mime, 'image/') => 'image',
            str_starts_with((string) $mime, 'video/') => 'video',
            str_starts_with((string) $mime, 'audio/') => 'audio',
            default => 'document',
        };
    }

    public function destroy(DeleteUploadRequest $request): JsonResponse
    {
        $path = $request->validated('path');
        Storage::disk('public')->delete($path);

        AuditLog::create([
            'actor_id' => $request->user()->id,
            'action' => 'media.deleted',
            'metadata' => ['path' => $path],
            'ip_address' => $request->ip(),
        ]);

        return response()->json(null, 204);
    }
}
