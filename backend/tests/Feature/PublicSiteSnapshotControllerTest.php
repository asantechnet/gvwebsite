<?php

namespace Tests\Feature;

use App\Models\SiteSnapshot;
use Illuminate\Foundation\Testing\LazilyRefreshDatabase;
use Tests\TestCase;

class PublicSiteSnapshotControllerTest extends TestCase
{
    use LazilyRefreshDatabase;

    public function test_public_endpoint_returns_only_published_snapshots(): void
    {
        SiteSnapshot::factory()->create([
            'key' => 'home',
            'payload' => ['en' => ['hero' => ['title' => 'Published']]],
            'published_at' => now(),
        ]);
        SiteSnapshot::factory()->create([
            'key' => 'about',
            'payload' => ['en' => ['hero' => ['title' => 'Draft']]],
            'published_at' => null,
        ]);

        $this->getJson('/api/site/snapshots')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.key', 'home')
            ->assertJsonMissing(['title' => 'Draft']);
    }
}
