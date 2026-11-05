<?php

namespace Tests\Feature\Cms;

use App\Models\SiteSnapshot;
use App\Models\User;
use Illuminate\Foundation\Testing\LazilyRefreshDatabase;
use Tests\TestCase;

class SiteSnapshotControllerTest extends TestCase
{
    use LazilyRefreshDatabase;

    public function test_content_manager_can_publish_and_version_a_site_snapshot(): void
    {
        $user = User::factory()->create(['permissions' => ['content.manage']]);

        $response = $this->actingAs($user)->putJson('/api/cms/snapshots/home', [
            'payload' => ['prs' => ['hero' => ['title' => 'عنوان']]],
            'published' => true,
        ]);

        $response->assertCreated()
            ->assertJsonPath('data.key', 'home')
            ->assertJsonPath('data.version', 1);

        $this->assertDatabaseHas('site_snapshots', ['key' => 'home', 'version' => 1]);
        $this->assertDatabaseHas('audit_logs', [
            'actor_id' => $user->id,
            'action' => 'site_snapshot.updated',
        ]);

        $this->actingAs($user)->putJson('/api/cms/snapshots/home', [
            'payload' => ['prs' => ['hero' => ['title' => 'عنوان تازه']]],
            'published' => true,
        ])->assertOk()->assertJsonPath('data.version', 2);

        $this->assertSame(2, SiteSnapshot::query()->where('key', 'home')->value('version'));
    }

    public function test_returns_403_when_user_cannot_manage_content_or_settings(): void
    {
        $user = User::factory()->create(['permissions' => ['dashboard.view']]);

        $this->actingAs($user)->putJson('/api/cms/snapshots/home', [
            'payload' => ['value' => 'blocked'],
            'published' => true,
        ])->assertForbidden();
    }

    public function test_returns_422_for_unknown_or_oversized_snapshot(): void
    {
        $user = User::factory()->create(['permissions' => ['content.manage']]);

        $this->actingAs($user)->putJson('/api/cms/snapshots/unknown', [
            'payload' => ['value' => str_repeat('x', (2 * 1024 * 1024) + 1)],
            'published' => true,
        ])->assertUnprocessable()->assertJsonValidationErrors(['key', 'payload']);
    }

    public function test_snapshot_html_urls_and_brand_colors_are_sanitized_before_storage(): void
    {
        $user = User::factory()->create(['permissions' => ['content.manage']]);

        $this->actingAs($user)->putJson('/api/cms/snapshots/home', [
            'payload' => [
                'content' => '<p>Safe</p><script>alert(1)</script>',
                'href' => 'javascript:alert(1)',
                'primary' => 'not-a-color',
            ],
            'published' => true,
        ])->assertCreated()
            ->assertJsonPath('data.payload.content', '<p>Safe</p>')
            ->assertJsonPath('data.payload.href', '')
            ->assertJsonPath('data.payload.primary', '#f47e26');
    }
}
