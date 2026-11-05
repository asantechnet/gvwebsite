<?php

namespace Tests\Feature\Cms;

use App\Models\AuditLog;
use App\Models\User;
use Illuminate\Foundation\Testing\LazilyRefreshDatabase;
use Tests\TestCase;

class AuditLogControllerTest extends TestCase
{
    use LazilyRefreshDatabase;

    public function test_settings_manager_can_view_paginated_audit_history(): void
    {
        $actor = User::factory()->create();
        $viewer = User::factory()->create(['permissions' => ['settings.manage']]);
        AuditLog::factory()->create(['actor_id' => $actor->id, 'action' => 'site_snapshot.updated']);

        $this->actingAs($viewer)->getJson('/api/cms/audit-logs')
            ->assertOk()
            ->assertJsonPath('data.0.action', 'site_snapshot.updated')
            ->assertJsonPath('data.0.actor.name', $actor->name)
            ->assertJsonStructure(['data', 'links', 'meta']);
    }

    public function test_returns_403_without_settings_permission(): void
    {
        $viewer = User::factory()->create(['permissions' => ['dashboard.view']]);

        $this->actingAs($viewer)->getJson('/api/cms/audit-logs')->assertForbidden();
    }
}
