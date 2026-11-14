<?php

namespace Tests\Feature\Cms;

use App\Models\User;
use App\Support\UploadScanner;
use Illuminate\Foundation\Testing\LazilyRefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use RuntimeException;
use Tests\TestCase;

class UploadControllerTest extends TestCase
{
    use LazilyRefreshDatabase;

    public function test_media_manager_can_upload_an_allowed_image(): void
    {
        Storage::fake('public');
        $user = User::factory()->create(['permissions' => ['media.manage']]);

        $response = $this->actingAs($user)->postJson('/api/cms/uploads', [
            'kind' => 'image',
            'file' => $this->fakePng(),
        ]);

        $response->assertCreated()
            ->assertJsonPath('data.kind', 'image')
            ->assertJsonPath('data.name', 'header.png');

        Storage::disk('public')->assertExists($response->json('data.path'));
        $this->assertDatabaseHas('media_uploads', [
            'path' => $response->json('data.path'),
            'original_name' => 'header.png',
        ]);
        $this->assertDatabaseHas('audit_logs', [
            'actor_id' => $user->id,
            'action' => 'media.uploaded',
        ]);
    }

    public function test_media_manager_can_list_durable_uploads(): void
    {
        Storage::fake('public');
        $user = User::factory()->create(['permissions' => ['media.manage']]);
        $path = $this->actingAs($user)->postJson('/api/cms/uploads', [
            'kind' => 'image',
            'file' => $this->fakePng(),
        ])->assertCreated()->json('data.path');

        $this->actingAs($user)->getJson('/api/cms/uploads')
            ->assertOk()
            ->assertJsonPath('data.0.path', $path)
            ->assertJsonPath('data.0.name', 'header.png');
    }

    public function test_upload_is_rejected_when_malware_scanner_fails(): void
    {
        Storage::fake('public');
        $user = User::factory()->create(['permissions' => ['media.manage']]);
        $scanner = $this->mock(UploadScanner::class);
        $scanner->shouldReceive('scan')->once()->andThrow(new RuntimeException('The uploaded file did not pass the malware scan.'));

        $this->actingAs($user)->postJson('/api/cms/uploads', [
            'kind' => 'image',
            'file' => $this->fakePng(),
        ])->assertUnprocessable()->assertJsonValidationErrors('file');

        Storage::disk('public')->assertDirectoryEmpty('/');
    }

    public function test_media_manager_can_delete_managed_upload(): void
    {
        Storage::fake('public');
        Storage::disk('public')->put('uploads/image/2026/11/123e4567-e89b-12d3-a456-426614174000.png', 'image');
        $user = User::factory()->create(['permissions' => ['media.manage']]);

        $this->actingAs($user)->deleteJson('/api/cms/uploads', [
            'path' => 'uploads/image/2026/11/123e4567-e89b-12d3-a456-426614174000.png',
        ])->assertNoContent();

        Storage::disk('public')->assertMissing('uploads/image/2026/11/123e4567-e89b-12d3-a456-426614174000.png');
        $this->assertDatabaseHas('audit_logs', ['actor_id' => $user->id, 'action' => 'media.deleted']);
    }

    public function test_upload_rejects_kind_mismatch_and_requires_permission(): void
    {
        Storage::fake('public');
        $manager = User::factory()->create(['permissions' => ['media.manage']]);
        $viewer = User::factory()->create(['permissions' => ['dashboard.view']]);

        $this->actingAs($manager)->postJson('/api/cms/uploads', [
            'kind' => 'document',
            'file' => $this->fakePng(),
        ])->assertUnprocessable()->assertJsonValidationErrors('kind');

        $this->actingAs($viewer)->postJson('/api/cms/uploads', [
            'kind' => 'image',
            'file' => $this->fakePng(),
        ])->assertForbidden();
    }

    private function fakePng(): UploadedFile
    {
        return UploadedFile::fake()->createWithContent(
            'header.png',
            base64_decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII='),
        );
    }
}
