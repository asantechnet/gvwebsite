<?php

namespace Tests\Feature\Cms;

use App\Models\ContentRecord;
use App\Models\User;
use Illuminate\Foundation\Testing\LazilyRefreshDatabase;
use Tests\TestCase;

class ContentRecordControllerTest extends TestCase
{
    use LazilyRefreshDatabase;

    public function test_content_manager_can_create_sanitized_multilingual_content(): void
    {
        $user = User::factory()->create(['permissions' => ['content.manage']]);
        $payload = $this->payload();
        $payload['translations']['en']['content'] = '<p>Safe</p><script>alert(1)</script><a href="javascript:alert(1)">Unsafe</a>';

        $response = $this->actingAs($user)
            ->postJson('/api/cms/content/magazine', $payload);

        $response->assertCreated()
            ->assertJsonPath('data.slug', 'first-story');

        $stored = ContentRecord::query()->firstOrFail();
        $this->assertStringNotContainsString('<script', $stored->translations['en']['content']);
        $this->assertStringNotContainsString('javascript:', $stored->translations['en']['content']);
        $this->assertSame('magazine', $stored->collection);
    }

    public function test_record_cannot_be_read_through_another_collection(): void
    {
        $user = User::factory()->create(['permissions' => ['content.manage']]);
        $record = ContentRecord::factory()->create(['collection' => 'magazine']);

        $this->actingAs($user)
            ->getJson("/api/cms/content/services/{$record->id}")
            ->assertNotFound();
    }

    public function test_content_routes_require_permission(): void
    {
        $user = User::factory()->create(['permissions' => ['dashboard.view']]);

        $this->actingAs($user)
            ->postJson('/api/cms/content/magazine', $this->payload())
            ->assertForbidden();
    }

    /** @return array<string, mixed> */
    private function payload(): array
    {
        $translation = [
            'title' => 'First story',
            'excerpt' => 'A short summary.',
            'content' => '<p>Story content.</p>',
            'tags' => ['education'],
            'seoTitle' => 'First story',
            'metaDescription' => 'A first story for testing.',
            'imageAlt' => 'Students in a classroom',
        ];

        return [
            'slug' => 'first-story',
            'type' => 'post',
            'category' => 'education',
            'status' => 'draft',
            'featured' => false,
            'image' => null,
            'href' => null,
            'translations' => [
                'prs' => $translation,
                'ps' => $translation,
                'en' => $translation,
            ],
            'metadata' => [],
        ];
    }
}
